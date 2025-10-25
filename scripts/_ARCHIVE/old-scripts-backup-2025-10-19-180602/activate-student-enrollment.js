const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

const sql = neon(process.env.DATABASE_URL);

async function activateEnrollment() {
  const studentId = '98a92c53-6d0b-43b0-845f-373e8a5e18fc'; // student1
  const courseId = 'course_1759592846908_g8dtw';

  console.log('Activating enrollment...\n');

  try {
    // Update status to active
    const result = await sql`
      UPDATE student_courses 
      SET status = 'active'
      WHERE student_id = ${studentId}
      AND course_id = ${courseId}
      RETURNING *
    `;

    if (result.length > 0) {
      console.log('✅ Enrollment activated successfully!');
      console.log('\nEnrollment details:');
      console.table(result);
    } else {
      console.log('❌ No enrollment found');
    }
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

activateEnrollment()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
