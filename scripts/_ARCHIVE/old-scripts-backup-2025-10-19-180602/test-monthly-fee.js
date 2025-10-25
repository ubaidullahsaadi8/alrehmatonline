const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

const sql = neon(process.env.DATABASE_URL);

async function testMonthlyFee() {
  const studentId = '98a92c53-6d0b-43b0-845f-373e8a5e18fc'; // student1
  const courseId = 'course_1759592846908_g8dtw';

  console.log('Testing monthly fee update...\n');

  try {
    // Update to monthly fee type with amount
    console.log('1. Updating to monthly fee plan with 6666 amount...');
    const result = await sql`
      UPDATE student_courses
      SET 
        fee_type = 'monthly',
        total_fee = 0,
        monthly_amount = 6666,
        installments_count = 1,
        updated_at = NOW()
      WHERE student_id = ${studentId}
      AND course_id = ${courseId}
      RETURNING *
    `;

    console.log('✅ Updated successfully!');
    console.table(result);

    // Verify the update
    console.log('\n2. Verifying the update...');
    const verify = await sql`
      SELECT 
        fee_type,
        total_fee,
        monthly_amount,
        installments_count,
        currency,
        status
      FROM student_courses
      WHERE student_id = ${studentId}
      AND course_id = ${courseId}
    `;

    console.log('Current values:');
    console.table(verify);

    if (verify[0].fee_type === 'monthly' && verify[0].monthly_amount === '6666') {
      console.log('\n✅ Monthly fee plan is correctly saved!');
    } else {
      console.log('\n❌ Monthly fee plan not saved correctly!');
    }

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testMonthlyFee()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
