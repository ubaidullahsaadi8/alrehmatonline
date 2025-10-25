import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Checking Sara Ahmed enrollment in database...\n')

    // 1. Find Sara Ahmed
    const saraUsers = await sql`
      SELECT id, email, name, user_type, role
      FROM users 
      WHERE LOWER(email) LIKE '%sara%' OR LOWER(name) LIKE '%sara%'
    `

    console.log('👤 Sara Ahmed User Account:')
    
    if (saraUsers.length === 0) {
      return NextResponse.json({ 
        error: 'Sara Ahmed not found in users table',
        suggestion: 'Please check if Sara Ahmed account exists'
      })
    }

    const sara = saraUsers[0]

    // 2. Check user_courses table
    const userCoursesEnrollment = await sql`
      SELECT 
        uc.id as enrollment_id,
        uc.student_id,
        uc.course_id,
        uc.status,
        uc.fee,
        uc.created_at,
        c.title as course_title,
        c.instructor_id
      FROM user_courses uc
      LEFT JOIN courses c ON uc.course_id = c.id
      WHERE uc.student_id = ${sara.id}
    `

    // 3. Check student_courses table (if exists)
    let studentCoursesEnrollment = []
    try {
      studentCoursesEnrollment = await sql`
        SELECT 
          sc.id as enrollment_id,
          sc.student_id,
          sc.course_id,
          sc.status,
          sc.fee,
          sc.created_at,
          c.title as course_title
        FROM student_courses sc
        LEFT JOIN courses c ON sc.course_id = c.id
        WHERE sc.student_id = ${sara.id}
      `
    } catch (error) {
      console.log('student_courses table does not exist')
    }

    // 4. Get all available courses
    const allCourses = await sql`
      SELECT id, title, instructor_id, status
      FROM courses
      LIMIT 5
    `

    // 5. Check course_instructors relationships
    const courseInstructors = await sql`
      SELECT course_id, instructor_id
      FROM course_instructors
      LIMIT 5
    `

    return NextResponse.json({
      sara_account: {
        id: sara.id,
        name: sara.name,
        email: sara.email,
        user_type: sara.user_type,
        role: sara.role
      },
      enrollments: {
        user_courses: {
          count: userCoursesEnrollment.length,
          enrollments: userCoursesEnrollment
        },
        student_courses: {
          count: studentCoursesEnrollment.length,
          enrollments: studentCoursesEnrollment
        }
      },
      available_courses: allCourses,
      course_instructors: courseInstructors,
      summary: {
        sara_found: true,
        enrolled_in_user_courses: userCoursesEnrollment.length > 0,
        enrolled_in_student_courses: studentCoursesEnrollment.length > 0,
        total_enrollments: userCoursesEnrollment.length + studentCoursesEnrollment.length
      }
    })

  } catch (error: any) {
    console.error('❌ Database check error:', error)
    return NextResponse.json({ 
      error: 'Database check failed',
      details: error.message 
    }, { status: 500 })
  }
}
