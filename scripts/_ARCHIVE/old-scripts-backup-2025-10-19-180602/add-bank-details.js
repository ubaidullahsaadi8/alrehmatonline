const { neon } = require('@neondatabase/serverless');

require('dotenv').config();
const sql = neon(process.env.DATABASE_URL);

async function addBankDetails() {
  console.log('🔄 Adding bank details functionality...');
  
  try {
    // Add bank details table
    console.log('Creating bank_details table...');
    await sql`
      CREATE TABLE IF NOT EXISTS bank_details (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        bank_name VARCHAR(255) NOT NULL,
        account_holder_name VARCHAR(255) NOT NULL,
        account_number VARCHAR(100) NOT NULL,
        routing_number VARCHAR(50),
        swift_code VARCHAR(20),
        iban VARCHAR(50),
        bank_address TEXT,
        currency VARCHAR(10) DEFAULT 'USD',
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Add bank_details_id column to fee_plans
    console.log('Adding bank_details_id to fee_plans...');
    await sql`
      ALTER TABLE fee_plans 
      ADD COLUMN IF NOT EXISTS bank_details_id TEXT REFERENCES bank_details(id)
    `;

    // Add payment instructions to fee_plans
    console.log('Adding payment_instructions to fee_plans...');
    await sql`
      ALTER TABLE fee_plans 
      ADD COLUMN IF NOT EXISTS payment_instructions TEXT
    `;

    // Create indexes
    console.log('Creating indexes...');
    await sql`CREATE INDEX IF NOT EXISTS idx_bank_details_currency ON bank_details(currency)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_bank_details_active ON bank_details(is_active)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_fee_plans_bank_details ON fee_plans(bank_details_id)`;

    console.log('✅ Bank details tables created successfully!');

    // Add sample bank details
    console.log('🔄 Adding sample bank details...');
    
    const [bankDetail1] = await sql`
      INSERT INTO bank_details (
        bank_name, 
        account_holder_name, 
        account_number, 
        routing_number, 
        bank_address, 
        currency
      )
      VALUES (
        'First National Bank',
        'Education Institute LLC',
        '1234567890',
        '123456789',
        '123 Main Street, New York, NY 10001',
        'USD'
      )
      RETURNING id
    `;

    const [bankDetail2] = await sql`
      INSERT INTO bank_details (
        bank_name, 
        account_holder_name, 
        account_number, 
        swift_code, 
        iban,
        bank_address, 
        currency
      )
      VALUES (
        'International Education Bank',
        'Global Learning Center',
        '9876543210',
        'EDUBANK001',
        'US12EDUB0001234567890',
        '456 Education Blvd, San Francisco, CA 94101',
        'USD'
      )
      RETURNING id
    `;

    // Update existing fee plans with bank details
    console.log('🔄 Updating fee plans with bank details...');
    
    const feePlans = await sql`SELECT id FROM fee_plans LIMIT 2`;
    
    if (feePlans.length > 0) {
      await sql`
        UPDATE fee_plans 
        SET 
          bank_details_id = ${bankDetail1.id},
          payment_instructions = 'Please include your student ID and course name in the payment reference.'
        WHERE id = ${feePlans[0].id}
      `;
      
      if (feePlans.length > 1) {
        await sql`
          UPDATE fee_plans 
          SET 
            bank_details_id = ${bankDetail2.id},
            payment_instructions = 'Use your full name and course code as payment reference. Allow 2-3 business days for processing.'
          WHERE id = ${feePlans[1].id}
        `;
      }
    }

    console.log('✅ Sample bank details added successfully!');

  } catch (error) {
    console.error('❌ Error adding bank details:', error);
  }
}

// Run the migration
addBankDetails().then(() => {
  console.log('🎉 Bank details migration completed!');
  process.exit(0);
});