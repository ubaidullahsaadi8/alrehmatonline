import { sql } from "../lib/db";
import { promises as fs } from 'fs';
import path from 'path';

async function executeSQLScript() {
  try {
    console.log('Reading SQL script file...');
    const sqlFilePath = path.join(process.cwd(), 'scripts', 'create_course_tables.sql');
    const sqlContent = await fs.readFile(sqlFilePath, 'utf-8');
    
    console.log('Executing SQL script...');
    await sql.unsafe(sqlContent);
    
    console.log('Checking if tables were created successfully...');
    
    const courseRequestsCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'course_requests'
      );
    `;
    
    const courseBookingsCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'course_bookings'
      );
    `;
    
    console.log(`course_requests table exists: ${JSON.stringify(courseRequestsCheck[0].exists)}`);
    console.log(`course_bookings table exists: ${JSON.stringify(courseBookingsCheck[0].exists)}`);
    
    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

executeSQLScript()
  .then(() => console.log('Done'))
  .catch(err => console.error(err));
