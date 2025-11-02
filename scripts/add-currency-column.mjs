import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function addCurrencyColumn() {
  try {
    console.log('Adding currency column to services table...');
    
    const sql = neon(process.env.DATABASE_URL);
    
    // Add currency column if it doesn't exist
    await sql`ALTER TABLE services ADD COLUMN IF NOT EXISTS currency text DEFAULT 'USD'`;
    
    // Update existing records to have USD as default currency
    await sql`UPDATE services SET currency = 'USD' WHERE currency IS NULL`;
    
    console.log('✅ Migration completed successfully!');
    console.log('Currency column added to services table with default value USD');
    
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

addCurrencyColumn();
