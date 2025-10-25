import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateAndDropUserCourses() {
  try {
    console.log('Starting migration...');

    // 1. Drop foreign key constraint from course_payments
    console.log('Dropping foreign key constraint...');
    await prisma.$executeRaw`
      ALTER TABLE course_payments 
      DROP CONSTRAINT IF EXISTS course_payments_user_course_id_fkey;
    `;

    // 2. Get all course payments
    const payments = await prisma.$queryRaw`
      SELECT * FROM course_payments 
      WHERE user_course_id IN (SELECT id FROM user_courses);
    `;
    console.log(`Found ${payments.length} payments to migrate`);

    // 3. Get mapping of user_courses to student_courses
    const enrollments = await prisma.$queryRaw`
      SELECT 
        uc.id as old_id,
        sc.id as new_id
      FROM user_courses uc
      JOIN student_courses sc ON 
        sc.student_id = uc.user_id AND
        sc.course_id = uc.course_id;
    `;
    
    const enrollmentMap = new Map(enrollments.map(e => [e.old_id, e.new_id]));
    console.log(`Found ${enrollments.length} enrollment mappings`);

    // 4. Update payment references
    for (const payment of payments) {
      const newEnrollmentId = enrollmentMap.get(payment.user_course_id);
      if (newEnrollmentId) {
        await prisma.$executeRaw`
          UPDATE course_payments 
          SET user_course_id = ${newEnrollmentId}
          WHERE id = ${payment.id};
        `;
        console.log(`Updated payment ${payment.id}`);
      }
    }

    // 5. Now we can safely drop the user_courses table
    console.log('Dropping user_courses table...');
    await prisma.$executeRaw`DROP TABLE IF EXISTS user_courses;`;

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateAndDropUserCourses();