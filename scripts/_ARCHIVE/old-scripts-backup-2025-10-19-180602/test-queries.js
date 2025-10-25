require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

async function testQueries() {
  try {
    const sql = neon(process.env.DATABASE_URL);
    
    // Test users table
    console.log('Testing users table...');
    const userColumns = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users'
    `;
    console.log('User table columns:', userColumns);
    
    // Test course_instructors table
    console.log('\nTesting course_instructors table...');
    const ciColumns = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'course_instructors'
    `;
    console.log('Course instructors table columns:', ciColumns);
    
    // Test a sample query
    console.log('\nTesting sample query...');
    const testInstructorId = 'b8faa774-726d-48ff-a1bb-02d9bfe4ff33';
    const courses = await sql`
      SELECT 
        c.id,
        c.title,
        ci.status as assignment_status,
        ci.role as instructor_role
      FROM courses c
      JOIN course_instructors ci ON c.id = ci.course_id
      WHERE ci.instructor_id = ${testInstructorId}
      AND ci.status = 'active'
      LIMIT 1
    `;
    console.log('Sample course query result:', courses);
    
  } catch (error) {
    console.error('Error during tests:', error);
  }
}

testQueries();