import { sql } from '../lib/db';

async function main() {
  console.log('Starting migration: Adding currency column to users table...');
  
  try {
    
    const columnCheck = await sql.unsafe(`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'currency'
      ) as has_column;
    `);
    
    
    let hasColumn = false;
    if (Array.isArray(columnCheck) && 
        columnCheck.length > 0 && 
        typeof columnCheck[0] === 'object' && 
        columnCheck[0] !== null) {
      hasColumn = columnCheck[0].has_column === true;
    }
    
    if (!hasColumn) {
      console.log('Currency column does not exist. Adding it now...');
      
      await sql.unsafe(`
        ALTER TABLE users 
        ADD COLUMN currency VARCHAR(5) DEFAULT 'USD' NOT NULL;
      `);
      console.log('Currency column added successfully with default value "USD"!');
    } else {
      console.log('Currency column already exists. No changes needed.');
    }
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  }
  
  console.log('Migration completed successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => process.exit(0));
