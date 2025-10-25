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
    
    // Try to fetch an existing user
    const users = await prisma.$queryRaw`SELECT * FROM users LIMIT 1`;
    if (users && users.length > 0) {
      console.log('Found users in the database:', users.length);
      
      
      const userSample = {...users[0]};
      if (userSample.password) {
        userSample.password = '[REDACTED]';
      }
      
      console.log('Sample user:', userSample);
    } else {
      console.log('No users found in the database');
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
