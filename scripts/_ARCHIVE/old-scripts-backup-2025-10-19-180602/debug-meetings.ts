import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

async function debugMeetings() {
  console.log('=== Debugging Meeting Data ===\n')

  // Check courses table for meeting data
  console.log('1. Checking courses table for meeting information:')
  const courses = await sql`
    SELECT 
      id, 
      title, 
      instructor_id,
      meeting_link, 
      meeting_date, 
      meeting_time,
      updated_at
    FROM courses 
    WHERE meeting_link IS NOT NULL 
       OR meeting_date IS NOT NULL 
       OR meeting_time IS NOT NULL
    ORDER BY updated_at DESC
    LIMIT 10
  `
  console.log(`Found ${courses.length} courses with meeting data:`)
  console.table(courses)

  // Check student_courses table
  console.log('\n2. Checking student_courses table:')
  const studentCourses = await sql`
    SELECT 
      id,
      student_id,
      course_id,
      status,
      enrollment_date
    FROM student_courses
    WHERE status = 'active'
    LIMIT 10
  `
  console.log(`Found ${studentCourses.length} active student enrollments:`)
  console.table(studentCourses)

  // Check if there's a specific course with meeting data
  if (courses.length > 0) {
    const testCourseId = courses[0].id
    console.log(`\n3. Checking enrollments for course: ${testCourseId}`)
    
    const enrollments = await sql`
      SELECT 
        sc.student_id,
        sc.course_id,
        sc.status,
        u.name as student_name,
        u.email as student_email
      FROM student_courses sc
      LEFT JOIN users u ON sc.student_id = u.id
      WHERE sc.course_id = ${testCourseId}
    `
    console.log(`Found ${enrollments.length} enrollments:`)
    console.table(enrollments)

    // Try the actual query from the API
    if (enrollments.length > 0) {
      const testStudentId = enrollments[0].student_id
      console.log(`\n4. Testing API query for student: ${testStudentId}`)
      
      const meetings = await sql`
        SELECT 
          c.id as course_id,
          c.title as course_title,
          c.category as course_category,
          c.meeting_link,
          c.meeting_date,
          c.meeting_time,
          c.instructor_id,
          u.name as instructor_name,
          u.avatar as instructor_avatar
        FROM student_courses sc
        JOIN courses c ON sc.course_id = c.id
        LEFT JOIN users u ON c.instructor_id = u.id
        WHERE sc.student_id = ${testStudentId}
        AND sc.status = 'active'
      `
      console.log(`Found ${meetings.length} meetings for student:`)
      console.table(meetings)
    }
  }

  // Check the specific course from the curl request
  console.log('\n5. Checking specific course from curl: course_1759592846908_g8dtw')
  const specificCourse = await sql`
    SELECT * FROM courses WHERE id = 'course_1759592846908_g8dtw'
  `
  console.log('Course data:')
  console.table(specificCourse)

  if (specificCourse.length > 0) {
    const enrolledStudents = await sql`
      SELECT 
        sc.*,
        u.name as student_name,
        u.email as student_email
      FROM student_courses sc
      LEFT JOIN users u ON sc.student_id = u.id
      WHERE sc.course_id = 'course_1759592846908_g8dtw'
    `
    console.log(`\nStudents enrolled in this course: ${enrolledStudents.length}`)
    console.table(enrolledStudents)
  }
}

debugMeetings()
  .then(() => {
    console.log('\n=== Debug Complete ===')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Error:', error)
    process.exit(1)
  })
