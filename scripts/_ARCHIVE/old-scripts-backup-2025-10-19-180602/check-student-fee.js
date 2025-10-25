const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

const sql = neon(process.env.DATABASE_URL);

async function checkStudentFee() {
  const studentId = '98a92c53-6d0b-43b0-845f-373e8a5e18fc'; // student1
  const courseId = 'course_1759592846908_g8dtw';

  console.log('Checking student fee in database...\n');

  try {
    const result = await sql`
      SELECT 
        id,
        student_id,
        course_id,
        fee_type,
        total_fee,
        monthly_amount,
        installments_count,
        paid_amount,
        currency,
        status,
        updated_at
      FROM student_courses
      WHERE student_id = ${studentId}
      AND course_id = ${courseId}
    `;

    console.log('Database record:');
    console.table(result);

    if (result.length > 0) {
      const record = result[0];
      console.log('\nDetailed values:');
      console.log('- fee_type:', record.fee_type);
      console.log('- total_fee:', record.total_fee);
      console.log('- monthly_amount:', record.monthly_amount);
      console.log('- currency:', record.currency);
      console.log('- status:', record.status);
    }

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkStudentFee()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
