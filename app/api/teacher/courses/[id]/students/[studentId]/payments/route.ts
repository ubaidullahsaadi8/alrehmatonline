import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getSession } from '@/lib/session'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string, studentId: string } }
) {
  try {
    // Check authentication
    const user = await getSession()
    if (!user || user.user_type !== 'instructor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: courseId, studentId } = params
    const { amount, payment_method, reference, notes } = await request.json()

    // Check instructor access
    const courseAccess = await sql`
      SELECT id FROM course_instructors 
      WHERE course_id = ${courseId} AND instructor_id = ${user.id} AND status = 'active'
      LIMIT 1
    `

    if (courseAccess.length === 0) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Get enrollment
    const enrollment = await sql`
      SELECT id FROM student_courses 
      WHERE student_id = ${studentId} AND course_id = ${courseId}
      LIMIT 1
    `

    if (enrollment.length === 0) {
      return NextResponse.json({ error: 'Student enrollment not found' }, { status: 404 })
    }

    const userCourseId = enrollment[0].id

    // Create payment record
    const payment = await sql`
      INSERT INTO course_payments (
        user_course_id,
        amount,
        payment_method,
        reference,
        notes,
        created_by
      )
      VALUES (
        ${userCourseId},
        ${amount},
        ${payment_method || 'cash'},
        ${reference || null},
        ${notes || null},
        ${user.id}
      )
      RETURNING *
    `

    // Update paid amount in user_courses
    await sql`
      UPDATE student_courses
      SET 
        paid_amount = paid_amount + ${amount},
        updated_at = NOW()
      WHERE id = ${userCourseId}
    `

    return NextResponse.json({ 
      message: 'Payment recorded successfully',
      payment: payment[0]
    })

  } catch (error) {
    console.error('Error recording payment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}