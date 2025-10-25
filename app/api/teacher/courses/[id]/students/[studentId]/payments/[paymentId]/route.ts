import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getSession } from '@/lib/session'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string, studentId: string, paymentId: string } }
) {
  try {
    // Check authentication
    const user = await getSession()
    if (!user || user.user_type !== 'instructor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: courseId, paymentId } = params
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

    // Get current payment
    const currentPayment = await sql`
      SELECT cp.*, uc.user_id, uc.paid_amount as old_paid_amount
      FROM course_payments cp
      INNER JOIN user_courses uc ON cp.user_course_id = uc.id
      WHERE cp.id = ${paymentId} AND uc.course_id = ${courseId}
      LIMIT 1
    `

    if (currentPayment.length === 0) {
      return NextResponse.json({ error: 'Payment record not found' }, { status: 404 })
    }

    const payment = currentPayment[0]
    const oldAmount = Number(payment.amount)
    const newAmount = Number(amount)
    const amountDifference = newAmount - oldAmount

    // Update payment record
    const updatedPayment = await sql`
      UPDATE course_payments 
      SET 
        amount = ${amount},
        payment_method = ${payment_method || payment.payment_method},
        reference = ${reference || payment.reference},
        notes = ${notes || payment.notes}
      WHERE id = ${paymentId}
      RETURNING *
    `

    // Update paid amount in user_courses
    await sql`
      UPDATE user_courses
      SET 
        paid_amount = paid_amount + ${amountDifference},
        updated_at = NOW()
      WHERE id = ${payment.user_course_id}
    `

    return NextResponse.json({ 
      message: 'Payment updated successfully',
      payment: updatedPayment[0]
    })

  } catch (error) {
    console.error('Error updating payment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string, studentId: string, paymentId: string } }
) {
  try {
    // Check authentication
    const user = await getSession()
    if (!user || user.user_type !== 'instructor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: courseId, paymentId } = params

    // Check instructor access
    const courseAccess = await sql`
      SELECT id FROM course_instructors 
      WHERE course_id = ${courseId} AND instructor_id = ${user.id} AND status = 'active'
      LIMIT 1
    `

    if (courseAccess.length === 0) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Get current payment to deduct amount
    const currentPayment = await sql`
      SELECT cp.*, uc.user_id
      FROM course_payments cp
      INNER JOIN user_courses uc ON cp.user_course_id = uc.id
      WHERE cp.id = ${paymentId} AND uc.course_id = ${courseId}
      LIMIT 1
    `

    if (currentPayment.length === 0) {
      return NextResponse.json({ error: 'Payment record not found' }, { status: 404 })
    }

    const payment = currentPayment[0]

    // Update paid amount in user_courses
    await sql`
      UPDATE user_courses
      SET 
        paid_amount = paid_amount - ${payment.amount},
        updated_at = NOW()
      WHERE id = ${payment.user_course_id}
    `

    // Delete payment record
    await sql`
      DELETE FROM course_payments 
      WHERE id = ${paymentId}
    `

    return NextResponse.json({ 
      message: 'Payment deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting payment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}