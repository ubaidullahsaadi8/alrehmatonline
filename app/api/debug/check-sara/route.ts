import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Find Sara Ahmed
    const users = await sql`
      SELECT id, email, name, role, user_type
      FROM users 
      WHERE email LIKE '%sara%' OR name LIKE '%Sara%'
    `

    if (users.length === 0) {
      return NextResponse.json({ error: 'Sara not found' })
    }

    const saraId = users[0].id
    
    // Check enrollments
    const enrollments = await sql`
      SELECT 
        uc.id,
        uc.student_id,
        uc.course_id,
        c.title as course_title,
        c.id as course_id_check,
        uc.created_at
      FROM user_courses uc
      LEFT JOIN courses c ON uc.course_id = c.id
      WHERE uc.student_id = ${saraId}
    `

    // Check all courses
    const allCourses = await sql`
      SELECT id, title, instructor_id
      FROM courses
      LIMIT 5
    `

    // Check course_instructors table
    const courseInstructors = await sql`
      SELECT course_id, instructor_id
      FROM course_instructors
      LIMIT 5
    `

    return NextResponse.json({
      sara: users[0],
      enrollments,
      allCourses,
      courseInstructors
    })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
