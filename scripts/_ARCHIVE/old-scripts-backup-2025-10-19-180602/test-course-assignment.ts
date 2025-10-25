import { neon } from "@neondatabase/serverless"
import dotenv from "dotenv"

dotenv.config()

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set.")
  process.exit(1)
}

const sql = neon(process.env.DATABASE_URL)

async function testAssignment() {
  try {
    console.log("=== Checking Data ===\n")

    // Check courses
    const courses = await sql`SELECT id, title FROM courses LIMIT 5`
    console.log("Available Courses:")
    courses.forEach(c => console.log(`  - ${c.id}: ${c.title}`))

    // Check instructors
    const instructors = await sql`SELECT id, name, email FROM users WHERE user_type = 'instructor' LIMIT 5`
    console.log("\nAvailable Instructors:")
    instructors.forEach(i => console.log(`  - ${i.id}: ${i.name} (${i.email})`))

    // Check existing assignments
    const assignments = await sql`
      SELECT ci.*, c.title as course_title, u.name as instructor_name
      FROM course_instructors ci
      JOIN courses c ON ci.course_id = c.id
      JOIN users u ON ci.instructor_id = u.id
      LIMIT 10
    `
    console.log("\nCurrent Course Assignments:")
    if (assignments.length === 0) {
      console.log("  No assignments found")
    } else {
      assignments.forEach(a => console.log(`  - ${a.course_title} → ${a.instructor_name} (${a.status})`))
    }

    // If we have courses and instructors but no assignments, create one
    if (courses.length > 0 && instructors.length > 0 && assignments.length === 0) {
      console.log("\n=== Creating Test Assignment ===")
      const testCourse = courses[0]
      const testInstructor = instructors[0]

      const newAssignment = await sql`
        INSERT INTO course_instructors (course_id, instructor_id, status, assigned_at)
        VALUES (${testCourse.id}, ${testInstructor.id}, 'active', NOW())
        RETURNING *
      `

      console.log(`\n✅ Assigned "${testCourse.title}" to ${testInstructor.name}`)
      console.log("Assignment ID:", newAssignment[0].id)
    }

  } catch (error) {
    console.error("Error:", error)
  }
}

testAssignment()
