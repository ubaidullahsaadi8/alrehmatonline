import { neon } from "@neondatabase/serverless"
import dotenv from "dotenv"

dotenv.config()

const sql = neon(process.env.DATABASE_URL!)

async function testTeacherAPI() {
  try {
    const teacherId = "b8faa774-726d-48ff-a1bb-02d9bfe4ff33"
    
    console.log("Testing SQL query that the API uses...\n")
    
    const courses = await sql`
      SELECT 
        c.id,
        c.title,
        c.description,
        c.image,
        c.level,
        c.duration,
        c.category,
        c.price,
        ci.assigned_at,
        ci.status as assignment_status,
        (
          SELECT COUNT(*)::int 
          FROM student_courses sc 
          WHERE uc.course_id = c.id 
          AND uc.status = 'active'
        ) as student_count
      FROM courses c
      INNER JOIN course_instructors ci ON c.id = ci.course_id
      WHERE ci.instructor_id = ${teacherId}
      AND ci.status = 'active'
      ORDER BY ci.assigned_at DESC
    `
    
    console.log("Query Result:")
    console.log(JSON.stringify(courses, null, 2))
    
    if (courses.length === 0) {
      console.log("\n❌ No courses found for this teacher!")
      console.log("Let's check the course_instructors table:")
      
      const allAssignments = await sql`
        SELECT * FROM course_instructors 
        WHERE instructor_id = ${teacherId}
      `
      console.log("\nAll assignments for this teacher:")
      console.log(JSON.stringify(allAssignments, null, 2))
    } else {
      console.log(`\n✅ Found ${courses.length} course(s) for teacher`)
    }
    
  } catch (error) {
    console.error("Error:", error)
  }
}

testTeacherAPI()
