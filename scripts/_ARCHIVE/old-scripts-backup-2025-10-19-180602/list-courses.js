const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);

async function listCourses() {
  try {
    const courses = await sql`
      SELECT id, title, instructor_id 
      FROM courses 
      ORDER BY created_at DESC
    `;
    
    console.log('Available Courses:');
    courses.forEach(c => {
      console.log(`${c.id}: ${c.title}`);
    });

  } catch (error) {
    console.error('Error listing courses:', error);
  }
}

listCourses();