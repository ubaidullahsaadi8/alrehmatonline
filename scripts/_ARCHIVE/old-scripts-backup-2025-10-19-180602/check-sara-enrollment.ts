import { sql } from '../lib/db.js'

async function checkSaraEnrollment() {
  try {
    console.log('🔍 Checking Sara Ahmed enrollment...\n')

    // Find Sara Ahmed
    const users = await sql`
      SELECT id, email, name, role, user_type
      FROM users 
      WHERE email LIKE '%sara%' OR name LIKE '%Sara%'
    `

    console.log('📋 Sara Ahmed User:')
    console.log(users)
    console.log('')

    if (users.length > 0) {
      const saraId = users[0].id
      
      // Check enrollments
      const enrollments = await sql`
        SELECT 
          uc.id,
          uc.student_id,
          uc.course_id,
          c.title as course_title,
          uc.created_at
        FROM student_courses sc
        LEFT JOIN courses c ON uc.course_id = c.id
        WHERE uc.student_id = ${saraId}
      `

      console.log('📚 Sara\'s Enrollments:')
      console.log(enrollments)
      console.log('')

      // Check all courses
      const allCourses = await sql`
        SELECT id, title, instructor_id
        FROM courses
        LIMIT 5
      `

      console.log('📖 Available Courses:')
      console.log(allCourses)
    }

  } catch (error: any) {
    console.error('❌ Error:', error.message)
  }
}

checkSaraEnrollment()
