// Script to enroll test students in the course
require('dotenv').config()
const { neon } = require('@neondatabase/serverless')

const sql = neon(process.env.DATABASE_URL)

async function enrollTestStudents() {
  try {
    const courseId = 'course_1759592846908_g8dtw'
    
    console.log('Creating and enrolling test students in course:', courseId)
    
    // Create 3 test students
    const students = [
      {
        id: crypto.randomUUID(),
        name: 'Ali Khan',
        email: 'ali.khan@example.com',
        user_type: 'simple'
      },
      {
        id: crypto.randomUUID(),
        name: 'Sara Ahmed',
        email: 'sara.ahmed@example.com',
        user_type: 'simple'
      },
      {
        id: crypto.randomUUID(),
        name: 'Hassan Ali',
        email: 'hassan.ali@example.com',
        user_type: 'simple'
      }
    ]
    
    for (const student of students) {
      // Check if user already exists
      const existingUser = await sql`
        SELECT id FROM users WHERE email = ${student.email} LIMIT 1
      `
      
      let userId = student.id
      
      if (existingUser.length === 0) {
        // Create user
        console.log(`\nCreating student: ${student.name}`)
        await sql`
          INSERT INTO users (
            id, email, password, name, username, user_type, role, 
            active, created_at, updated_at
          )
          VALUES (
            ${student.id},
            ${student.email},
            '$2a$10$dummypasswordhash',
            ${student.name},
            ${student.email.split('@')[0]},
            ${student.user_type},
            'user',
            true,
            NOW(),
            NOW()
          )
        `
      } else {
        userId = existingUser[0].id
        console.log(`\nStudent already exists: ${student.name}`)
      }
      
      // Check if already enrolled
      const enrollment = await sql`
        SELECT id FROM student_courses 
        WHERE user_id = ${userId} AND course_id = ${courseId}
        LIMIT 1
      `
      
      if (enrollment.length === 0) {
        // Enroll in course
        console.log(`Enrolling ${student.name} in course...`)
        await sql`
          INSERT INTO student_courses (
            id, user_id, course_id, enrollment_date, status, total_fee, paid_amount, created_at
          )
          VALUES (
            ${crypto.randomUUID()},
            ${userId},
            ${courseId},
            NOW(),
            'active',
            0,
            0,
            NOW()
          )
        `
        console.log(`✅ ${student.name} enrolled successfully!`)
      } else {
        console.log(`⚠️ ${student.name} is already enrolled`)
      }
    }
    
    // Show total enrollments
    const totalEnrolled = await sql`
      SELECT COUNT(*) as count 
      FROM student_courses 
      WHERE course_id = ${courseId}
    `
    
    console.log(`\n✅ Total students enrolled in course: ${totalEnrolled[0].count}`)
    
  } catch (error) {
    console.error('\n❌ Error:', error.message)
    console.error('Stack:', error.stack)
  }
}

enrollTestStudents()
