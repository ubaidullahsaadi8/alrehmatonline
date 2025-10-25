import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function assignTeacherToCourse(teacherEmail, courseId) {
  try {
    // Get teacher ID
    const teacher = await prisma.users.findFirst({
      where: {
        email: teacherEmail,
        OR: [
          { user_type: 'instructor' },
          { role: 'instructor' }
        ]
      }
    });

    if (!teacher) {
      console.error('Teacher not found:', teacherEmail);
      return;
    }

    // Create course_instructors record
    const assignment = await prisma.$executeRaw`
      INSERT INTO course_instructors (
        id,
        instructor_id,
        course_id,
        status
      ) VALUES (
        ${crypto.randomUUID()},
        ${teacher.id},
        ${courseId},
        'active'
      )
      ON CONFLICT (instructor_id, course_id) 
      DO UPDATE SET status = 'active'
      RETURNING *;
    `;

    console.log('Successfully assigned teacher to course');

  } catch (error) {
    console.error('Error assigning teacher to course:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Get command line arguments
const teacherEmail = process.argv[2];
const courseId = process.argv[3];

if (!teacherEmail || !courseId) {
  console.error('Usage: node assign-teacher.js <teacher_email> <course_id>');
  process.exit(1);
}

assignTeacherToCourse(teacherEmail, courseId);