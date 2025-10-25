const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Verifying database schema...');
    
    
    const result = await prisma.$queryRaw`
      SELECT column_name, data_type, column_default
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position;
    `;
    
    console.log('Users table schema:');
    console.table(result);
    
    // Check if all the columns we need are present
    const requiredColumns = [
      'id', 'email', 'password', 'name', 
      'username', 'role', 'user_type', 'account_status', 
      'is_approved', 'active', 'country', 'education', 
      'currency', 'member_type'
    ];
    
    const existingColumns = result.map(col => col.column_name);
    const missingColumns = requiredColumns.filter(col => !existingColumns.includes(col));
    
    if (missingColumns.length > 0) {
      console.error('Missing columns in users table:', missingColumns);
      
      // Add missing columns
      console.log('Adding missing columns...');
      
      for (const column of missingColumns) {
        try {
          let sql_statement = '';
          
          switch (column) {
            case 'username':
              sql_statement = `ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(255) UNIQUE`;
              break;
            case 'user_type':
              sql_statement = `ALTER TABLE users ADD COLUMN IF NOT EXISTS user_type VARCHAR(50) DEFAULT 'simple'`;
              break;
            case 'account_status':
              sql_statement = `ALTER TABLE users ADD COLUMN IF NOT EXISTS account_status VARCHAR(50) DEFAULT 'active'`;
              break;
            case 'is_approved':
              sql_statement = `ALTER TABLE users ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT FALSE`;
              break;
            case 'country':
              sql_statement = `ALTER TABLE users ADD COLUMN IF NOT EXISTS country VARCHAR(50)`;
              break;
            case 'education':
              sql_statement = `ALTER TABLE users ADD COLUMN IF NOT EXISTS education TEXT`;
              break;
            case 'currency':
              sql_statement = `ALTER TABLE users ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'USD'`;
              break;
            case 'member_type':
              sql_statement = `ALTER TABLE users ADD COLUMN IF NOT EXISTS member_type VARCHAR(50) DEFAULT 'common'`;
              break;
            default:
              console.log(`No default definition for column ${column}, skipping`);
              continue;
          }
          
          if (sql_statement) {
            await prisma.$executeRawUnsafe(sql_statement);
            console.log(`Added column: ${column}`);
          }
        } catch (err) {
          console.error(`Error adding column ${column}:`, err);
        }
      }
    } else {
      console.log('✅ All required columns are present in the users table.');
    }
    
    console.log('Validation completed successfully!');
  } catch (error) {
    console.error('Validation failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
