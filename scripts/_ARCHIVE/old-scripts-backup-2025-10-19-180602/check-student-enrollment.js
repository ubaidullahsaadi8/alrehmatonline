import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkStudentEnrollment() {
  try {
    const enrollments = await prisma.$queryRaw`
      SELECT 
        sc.id as enrollment_id,
        sc.student_id,
        u.name as student_name,
        u.email as student_email,
        sc.course_id,
        c.title as course_title,
        sc.status,
        sc.enrollment_date,
        sc.total_fee,
        sc.paid_amount,
        sc.currency
      FROM student_courses sc
      JOIN users u ON u.id = sc.student_id
      JOIN courses c ON c.id = sc.course_id
      WHERE sc.course_id = ${'course_1759592846908_g8dtw'}
    `;

    console.log('\nStudent enrollments:');
    console.log('==================');
    
    enrollments.forEach(e => {
      console.log(`\nEnrollment ID: ${e.enrollment_id}`);
      console.log(`Student: ${e.student_name} (${e.student_email})`);
      console.log(`Course: ${e.course_title}`);
      console.log(`Status: ${e.status}`);
      console.log(`Enrolled: ${e.enrollment_date}`);
      console.log(`Fee: ${e.total_fee} ${e.currency}`);
      console.log(`Paid: ${e.paid_amount} ${e.currency}`);
      console.log('---------');
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkStudentEnrollment();