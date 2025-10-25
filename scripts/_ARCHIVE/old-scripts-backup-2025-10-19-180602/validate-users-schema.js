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
