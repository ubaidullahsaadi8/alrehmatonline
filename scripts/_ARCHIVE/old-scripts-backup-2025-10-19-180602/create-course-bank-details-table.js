require('dotenv').config({ path: '.env' });
const { neon } = require('@neondatabase/serverless');

async function createCourseBankDetailsTable() {
  const sql = neon(process.env.DATABASE_URL);

  try {
    console.log('Creating course_bank_details table...');

    await sql`
      CREATE TABLE IF NOT EXISTS course_bank_details (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        course_id VARCHAR(255) NOT NULL UNIQUE,
        bank_name VARCHAR(255),
        account_title VARCHAR(255),
        account_number VARCHAR(100),
        iban VARCHAR(100),
        branch_code VARCHAR(50),
        payment_instructions TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
      )
    `;

    console.log('✅ course_bank_details table created successfully!');

    // Create index for faster lookups
    await sql`
      CREATE INDEX IF NOT EXISTS idx_course_bank_details_course_id 
      ON course_bank_details(course_id)
    `;

    console.log('✅ Index created successfully!');

  } catch (error) {
    console.error('❌ Error creating table:', error);
    throw error;
  }
}

createCourseBankDetailsTable()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed:', error);
    process.exit(1);
  });
