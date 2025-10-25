import { sql } from '../lib/db'

async function main() {
  try {
    // Update existing records with default role
    await sql`
      UPDATE course_instructors
      SET role = 'instructor'
      WHERE role IS NULL
    `

    console.log('Successfully updated existing course_instructors records with default role')
  } catch (error) {
    console.error('Error updating course_instructors:', error)
    process.exit(1)
  }
}

main()