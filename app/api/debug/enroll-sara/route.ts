import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    // Find Sara Ahmed
    const saraUsers = await sql`
      SELECT id, email, name
      FROM users 
      WHERE email LIKE '%sara%' OR name LIKE '%Sara%'
    `

    if (saraUsers.length === 0) {
      return NextResponse.json({ error: 'Sara not found' }, { status: 404 })
    }

    const sara = saraUsers[0]

    // Find first available course
    const courses = await sql`
      SELECT id, title, instructor_id
      FROM courses
      LIMIT 1
    `

    if (courses.length === 0) {
      return NextResponse.json({ error: 'No courses found' }, { status: 404 })
    }

    const course = courses[0]

    // Check if already enrolled
    const existing = await sql`
      SELECT id FROM user_courses
      WHERE student_id = ${sara.id}
      AND course_id = ${course.id}
    `

    if (existing.length > 0) {
      return NextResponse.json({ 
        message: 'Already enrolled',
        enrollment: existing[0]
      })
    }

    // Create enrollment
    const enrollment = await sql`
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
      RETURNING *
    `

    return NextResponse.json({
      success: true,
      message: 'Sara enrolled successfully',
      sara,
      course,
      enrollment: enrollment[0]
    })

  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message,
      details: error
    }, { status: 500 })
  }
}
