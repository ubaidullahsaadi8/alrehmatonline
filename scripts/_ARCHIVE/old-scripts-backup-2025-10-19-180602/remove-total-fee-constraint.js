const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

const sql = neon(process.env.DATABASE_URL);

async function removeConstraint() {
  console.log('Removing NOT NULL constraint from total_fee column...\n');

  try {
    // Remove NOT NULL constraint
    await sql`
      ALTER TABLE student_courses 
      ALTER COLUMN total_fee DROP NOT NULL
    `;
    console.log('✅ Removed NOT NULL constraint from total_fee');

    // Also remove from other fee-related columns
    await sql`
      ALTER TABLE student_courses 
      ALTER COLUMN paid_amount DROP NOT NULL
    `;
    console.log('✅ Removed NOT NULL constraint from paid_amount');

    // Now reset all default fees to NULL
    console.log('\nResetting default fees to NULL...');
    const result = await sql`
      UPDATE student_courses
      SET 
        total_fee = NULL,
        paid_amount = NULL,
        monthly_amount = NULL,
        installments_count = NULL,
        fee_type = NULL
      WHERE total_fee = 5555
      RETURNING id, student_id, course_id
    `;

    console.log(`✅ Reset ${result.length} enrollments`);

    console.log('\n✅ All done! No more default fees.');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

removeConstraint()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
