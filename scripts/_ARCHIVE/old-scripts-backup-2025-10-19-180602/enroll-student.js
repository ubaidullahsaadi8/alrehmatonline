import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function enrollStudent(studentEmail, courseId) {
  try {
    // Get student details
    const student = await prisma.users.findFirst({
      where: {
        email: studentEmail,
        OR: [
          { user_type: 'student' },
          { user_type: null }
        ]
      }
    });

    if (!student) {
      console.error('Student not found:', studentEmail);
      return;
    }

    // Check if course exists
    const course = await prisma.courses.findUnique({
      where: { id: courseId }
    });

    if (!course) {
      console.error('Course not found:', courseId);
      return;
    }

    // Check if already enrolled
    const existing = await prisma.student_courses.findFirst({
      where: {
        student_id: student.id,
        course_id: courseId
      }
    });

    if (existing) {
      console.error('Student is already enrolled in this course');
      return;
    }

    // Enroll student
    const enrollment = await prisma.student_courses.create({
      data: {
        student_id: student.id,
        course_id: courseId,
        status: 'active',
        total_fee: course.price,
        currency: student.currency || 'USD',
        enrollment_date: new Date()
      }
    });

    console.log('Successfully enrolled student:', student.email);
    console.log('Enrollment ID:', enrollment.id);

  } catch (error) {
    console.error('Error enrolling student:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Get command line arguments
const studentEmail = process.argv[2];
const courseId = process.argv[3];

if (!studentEmail || !courseId) {
  console.error('Usage: node enroll-student.js <student_email> <course_id>');
  process.exit(1);
}

enrollStudent(studentEmail, courseId);