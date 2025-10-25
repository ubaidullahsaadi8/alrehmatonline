import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

async function main() {
  console.log('Starting database initialization...');
  
  try {

    console.log('Running Prisma migrations...');
    execSync('npx prisma migrate dev --name "course_requests_and_bookings"', { stdio: 'inherit' });
    
    console.log('Database schema has been successfully updated!');

    const prisma = new PrismaClient();
    

    console.log('Verifying database tables...');
    
    const courseRequestsTableExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'course_requests'
      );
    `;
    
    const courseBookingsTableExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'course_bookings'
      );
    `;
    
    console.log(`Course Requests table exists: ${JSON.stringify(courseRequestsTableExists)}`);
    console.log(`Course Bookings table exists: ${JSON.stringify(courseBookingsTableExists)}`);
    
    console.log('Database initialization completed successfully!');
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error during database initialization:', error);
    process.exit(1);
  }
}

main();
