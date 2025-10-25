import { sql } from '../lib/db'

async function main() {
  try {
    // Add role column to course_instructors table
    await sql`
      ALTER TABLE course_instructors 
      ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'instructor';
    `

    // Create index for better performance
    await sql`
      CREATE INDEX IF NOT EXISTS idx_course_instructors_role ON course_instructors(role);
    `

    console.log('Successfully added role column to course_instructors table')
  } catch (error) {
    console.error('Error adding role column:', error)
    process.exit(1)
  }
}

main()