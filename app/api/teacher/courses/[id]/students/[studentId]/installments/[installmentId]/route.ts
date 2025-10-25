import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getSession } from '@/lib/session'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string, studentId: string, installmentId: string }> }
) {
  try {
    // Check authentication
    const user = await getSession()
    if (!user || user.user_type !== 'instructor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: courseId, studentId, installmentId } = await params
    const { status, paid_date } = await request.json()

    // Check instructor access
    const courseAccess = await sql`
      SELECT id FROM course_instructors 
      WHERE course_id = ${courseId} AND instructor_id = ${user.id} AND status = 'active'
      LIMIT 1
    `

    if (courseAccess.length === 0) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Verify installment belongs to this student and course
    const installmentCheck = await sql`
      SELECT ci.id, ci.amount
      FROM course_installments ci
      INNER JOIN student_courses sc ON ci.user_course_id = sc.id
      WHERE ci.id = ${installmentId} 
        AND sc.student_id = ${studentId} 
        AND sc.course_id = ${courseId}
      LIMIT 1
    `

    if (installmentCheck.length === 0) {
      return NextResponse.json({ error: 'Installment not found' }, { status: 404 })
    }

    const installmentAmount = Number(installmentCheck[0].amount)

    // Update installment status
    const result = await sql`
      UPDATE course_installments
      SET 
        status = ${status},
        paid_date = ${paid_date || null}
      WHERE id = ${installmentId}
      RETURNING *
    `

    // If marked as paid, also update the paid_amount in student_courses
    if (status === 'paid' && paid_date) {
      await sql`
        UPDATE student_courses sc
        SET 
          paid_amount = COALESCE(paid_amount, 0) + ${installmentAmount}
        FROM course_installments ci
        WHERE ci.user_course_id = sc.id 
          AND ci.id = ${installmentId}
          AND sc.student_id = ${studentId}
          AND sc.course_id = ${courseId}
      `
    }
    
    // If unmarked (set back to pending), subtract from paid_amount
    if (status === 'pending') {
      await sql`
        UPDATE student_courses sc
        SET 
          paid_amount = GREATEST(0, COALESCE(paid_amount, 0) - ${installmentAmount})
        FROM course_installments ci
        WHERE ci.user_course_id = sc.id 
          AND ci.id = ${installmentId}
          AND sc.student_id = ${studentId}
          AND sc.course_id = ${courseId}
      `
    }

    return NextResponse.json({ 
      message: 'Installment status updated successfully',
      installment: result[0]
    })

  } catch (error) {
    console.error('Error updating installment status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
