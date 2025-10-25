import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkAssignment() {
  try {
    const assignments = await prisma.$queryRaw`
      SELECT 
        ci.id,
        ci.course_id,
        c.title as course_title,
        ci.instructor_id,
        u.name as instructor_name,
        u.email as instructor_email,
        ci.status,
        ci.assigned_at
      FROM course_instructors ci
      JOIN courses c ON c.id = ci.course_id
      JOIN users u ON u.id = ci.instructor_id
      WHERE ci.course_id = ${'course_1759592846908_g8dtw'}
    `;

    console.log('\nCourse instructor assignments:');
    console.log('============================');
    
    assignments.forEach(a => {
      console.log(`\nAssignment ID: ${a.id}`);
      console.log(`Course: ${a.course_title} (${a.course_id})`);
      console.log(`Instructor: ${a.instructor_name} (${a.instructor_email})`);
      console.log(`Status: ${a.status}`);
      console.log(`Assigned at: ${a.assigned_at}`);
      console.log('---------');
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAssignment();