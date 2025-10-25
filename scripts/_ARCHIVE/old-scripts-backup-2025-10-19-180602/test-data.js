import { sql } from "../lib/db.ts"

async function testData() {
  try {
    const courses = await sql`SELECT id, title FROM courses LIMIT 5`
    console.log('Available courses:', courses)

    const instructors = await sql`SELECT id, name, email FROM users WHERE user_type = 'instructor' LIMIT 5`
    console.log('Available instructors:', instructors)

    const assignments = await sql`SELECT * FROM course_instructors LIMIT 5`
    console.log('Current assignments:', assignments)
  } catch (error) {
    console.error('Error:', error)
  }
}

testData()