import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getSession } from '@/lib/session'

export async function POST(request: NextRequest) {
  try {
    const user = await getSession()
    
    // Allow only admin for this debug endpoint
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized - Admin only' }, { status: 401 })
    }

    // Find Sara Ahmed
    const students = await sql`
      SELECT id, email, name, user_type
      FROM users 
      WHERE user_type = 'student'
      AND (email LIKE '%sara%' OR LOWER(name) LIKE '%sara%')
    `

    if (students.length === 0) {
      return NextResponse.json({ error: 'Sara Ahmed not found' }, { status: 404 })
    }

    const sara = students[0]

    // Find available course with instructor
    const coursesWithInstructor = await sql`
      SELECT DISTINCT c.id, c.title, ci.instructor_id
      FROM courses c
      JOIN course_instructors ci ON c.id = ci.course_id
      LIMIT 1
    `

    if (coursesWithInstructor.length === 0) {
      return NextResponse.json({ error: 'No courses with instructors found' }, { status: 404 })
    }

    const course = coursesWithInstructor[0]

    // Check if already enrolled
    const existingEnrollment = await sql`
      SELECT id, course_id, student_id, status
      FROM user_courses
      WHERE student_id = ${sara.id}
      AND course_id = ${course.id}
    `

    if (existingEnrollment.length > 0) {
      return NextResponse.json({ 
        message: 'Sara is already enrolled in this course',
        enrollment: existingEnrollment[0],
        course: course
      })
    }

    // Create enrollment
    const newEnrollment = await sql`
      INSERT INTO user_courses (
        id,
        student_id,
        course_id,
        status,
        fee,
        discount,
        progress,
        created_at
      ) VALUES (
        gen_random_uuid()::text,
        ${sara.id},
        ${course.id},
        'enrolled',
        5000,
        0,
        0,
        NOW()
      )
      RETURNING id, student_id, course_id, status, fee, created_at
    `

    return NextResponse.json({
      success: true,
      message: 'Sara Ahmed enrolled successfully!',
      student: {
        id: sara.id,
        name: sara.name,
        email: sara.email
      },
      course: {
        id: course.id,
        title: course.title
      },
      enrollment: newEnrollment[0]
    })

  } catch (error: any) {
    console.error('Enrollment error:', error)
    return NextResponse.json({ 
      error: 'Failed to enroll Sara',
      details: error.message
    }, { status: 500 })
  }
}

// GET endpoint to check Sara's current enrollments
export async function GET(request: NextRequest) {
  try {
    const user = await getSession()
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find Sara
    const students = await sql`
      SELECT id, email, name
      FROM users 
      WHERE user_type = 'student'
      AND (email LIKE '%sara%' OR LOWER(name) LIKE '%sara%')
    `

    if (students.length === 0) {
      return NextResponse.json({ error: 'Sara not found' })
    }

    const sara = students[0]

    // Get enrollments
    const enrollments = await sql`
      SELECT 
        uc.id,
        uc.student_id,
        uc.course_id,
        uc.status,
        uc.fee,
        uc.created_at,
        c.title as course_title
      FROM user_courses uc
      LEFT JOIN courses c ON uc.course_id = c.id
      WHERE uc.student_id = ${sara.id}
    `

    return NextResponse.json({
      student: sara,
      enrollments,
      count: enrollments.length
    })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
