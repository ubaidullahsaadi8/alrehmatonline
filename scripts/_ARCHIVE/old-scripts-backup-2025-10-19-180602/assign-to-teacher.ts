import { neon } from "@neondatabase/serverless"
import dotenv from "dotenv"

dotenv.config()

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set.")
  process.exit(1)
}

const sql = neon(process.env.DATABASE_URL)

async function assignCourseToTeacher() {
  try {
    // The teacher with email teacher@gmail.com
    const teacherEmail = "teacher@gmail.com"
    const teacherId = "b8faa774-726d-48ff-a1bb-02d9bfe4ff33"

    console.log(`Assigning course to ${teacherEmail}...`)

    // Get a course to assign
    const course = await sql`
      SELECT id, title FROM courses 
      WHERE id = 'course_1759592846908_g8dtw'
      LIMIT 1
    `

    if (course.length === 0) {
      console.log("No course found")
      return
    }

    // Check if already assigned
    const existing = await sql`
      SELECT id FROM course_instructors 
      WHERE course_id = ${course[0].id} AND instructor_id = ${teacherId}
    `

    if (existing.length > 0) {
      console.log("Course already assigned to this teacher")
      return
    }

    // Assign the course
    const assignment = await sql`
      INSERT INTO course_instructors (course_id, instructor_id, status, assigned_at)
      VALUES (${course[0].id}, ${teacherId}, 'active', NOW())
      RETURNING *
    `

    console.log(`✅ Successfully assigned "${course[0].title}" to teacher@gmail.com`)
    console.log("Assignment details:", assignment[0])

  } catch (error) {
    console.error("Error:", error)
  }
}

assignCourseToTeacher()
