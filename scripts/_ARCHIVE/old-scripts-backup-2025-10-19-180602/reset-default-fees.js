const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

const sql = neon(process.env.DATABASE_URL);

async function resetDefaultFees() {
  console.log('Resetting default fees in student_courses table...\n');

  try {
    // First, check current state
    console.log('1. Current state of fees:');
    const currentFees = await sql`
      SELECT 
        id,
        student_id,
        course_id,
        total_fee,
        paid_amount,
        status
      FROM student_courses
      WHERE total_fee = 5555
      LIMIT 10
    `;
    console.log(`Found ${currentFees.length} enrollments with default fee (5555)`);
    console.table(currentFees);

    // Reset all default fees to NULL
    console.log('\n2. Resetting fees to NULL...');
    const result = await sql`
      UPDATE student_courses
      SET 
        total_fee = NULL,
        paid_amount = NULL,
        monthly_amount = NULL,
        installments_count = NULL,
        fee_type = NULL
      WHERE total_fee = 5555
      RETURNING id, student_id, course_id, total_fee
    `;

    console.log(`✅ Reset ${result.length} enrollments`);
    
    if (result.length > 0) {
      console.log('\nUpdated enrollments:');
      console.table(result);
    }

    // Verify the update
    console.log('\n3. Verifying update...');
    const verification = await sql`
      SELECT 
        COUNT(*) as total_enrollments,
        COUNT(total_fee) as enrollments_with_fee,
        COUNT(CASE WHEN total_fee = 5555 THEN 1 END) as default_fees_remaining
      FROM student_courses
    `;
    console.log('Verification results:');
    console.table(verification);

    console.log('\n✅ Default fees reset successfully!');
    console.log('Note: Teachers can now set custom fees for each student individually.');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

resetDefaultFees()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
