// Test script to verify teacher course API endpoint
require('dotenv').config()
const { neon } = require('@neondatabase/serverless')

const sql = neon(process.env.DATABASE_URL)

async function testTeacherCourseAPI() {
  try {
    const courseId = 'course_1759592846908_g8dtw'
    const instructorId = 'b8faa774-726d-48ff-a1bb-02d9bfe4ff33' // teacher@gmail.com
    
    console.log('Testing course API for:', { courseId, instructorId })
    
    // 1. Check if instructor has access
    console.log('\n1. Checking instructor access...')
    const courseAccess = await sql`
      SELECT id FROM course_instructors
      WHERE course_id = ${courseId}
      AND instructor_id = ${instructorId}
      AND status = 'active'
      LIMIT 1
    `
    console.log('Course access:', courseAccess.length > 0 ? '✅ YES' : '❌ NO')
    if (courseAccess.length > 0) {
      console.log('Assignment ID:', courseAccess[0].id)
    }
    
    // 2. Get course details
    console.log('\n2. Getting course details...')
    const courseResult = await sql`
      SELECT 
        c.*,
        COUNT(DISTINCT uc.user_id) as student_count
      FROM courses c
      LEFT JOIN student_courses sc ON c.id = sc.course_id AND sc.status = 'active'
      WHERE c.id = ${courseId}
      GROUP BY c.id
    `
    console.log('Course found:', courseResult.length > 0 ? '✅ YES' : '❌ NO')
    if (courseResult.length > 0) {
      const course = courseResult[0]
      console.log('Course:', {
        id: course.id,
        title: course.title,
        student_count: course.student_count
      })
    }
    
    // 3. Get enrolled students
    console.log('\n3. Getting enrolled students...')
    const students = await sql`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.phone,
        uc.enrollment_date,
        uc.status
      FROM users u
      INNER JOIN student_courses sc ON u.id = sc.student_id
      WHERE uc.course_id = ${courseId}
      ORDER BY uc.enrollment_date DESC
    `
    console.log(`Found ${students.length} student(s):`)
    students.forEach((s, i) => {
      console.log(`  ${i + 1}. ${s.name} (${s.email}) - Status: ${s.status}`)
    })
    
    console.log('\n✅ Test completed successfully!')
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message)
    console.error('Stack:', error.stack)
  }
}

testTeacherCourseAPI()
