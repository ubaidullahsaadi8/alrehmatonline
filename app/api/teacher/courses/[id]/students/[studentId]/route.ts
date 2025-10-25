import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getSession } from '@/lib/session'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string, studentId: string }> }
) {
  try {
    // Check authentication
    const user = await getSession()
    if (!user || user.user_type !== 'instructor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: courseId, studentId } = await params

    // Check instructor access
    const courseAccess = await sql`
      SELECT id FROM course_instructors 
      WHERE course_id = ${courseId} AND instructor_id = ${user.id} AND status = 'active'
      LIMIT 1
    `

    if (courseAccess.length === 0) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Get course details
    const courseResult = await sql`
      SELECT id, title, description
      FROM courses 
      WHERE id = ${courseId}
    `

    if (courseResult.length === 0) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }
    
    const course = courseResult[0]

    // Get student enrollment details
    const enrollmentResult = await sql`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.phone,
        u.currency,
        uc.id as enrollment_id,
        uc.enrollment_date,
        uc.status,
        uc.fee_type,
        uc.total_fee,
        uc.monthly_amount,
        uc.installments_count,
        uc.paid_amount,
        uc.due_date,
        uc.created_at
      FROM users u
      INNER JOIN student_courses uc ON u.id = uc.student_id
      WHERE u.id = ${studentId} AND uc.course_id = ${courseId}
    `

    if (enrollmentResult.length === 0) {
      return NextResponse.json({ error: 'Student not found in this course' }, { status: 404 })
    }
    
    const enrollment = enrollmentResult[0]

    // Get payment history
    const payments = await sql`
      SELECT 
        cp.id,
        cp.amount,
        cp.payment_date,
        cp.payment_method,
        cp.reference,
        cp.notes,
        cp.created_by
      FROM course_payments cp
      WHERE cp.user_course_id = ${enrollment.enrollment_id}
      ORDER BY cp.payment_date DESC
    `

    // Get installments if fee type is complete
    let installments: any[] = []
    if (enrollment.fee_type === 'complete') {
      installments = await sql`
        SELECT 
          id,
          installment_number,
          amount,
          due_date,
          status,
          paid_date
        FROM course_installments
        WHERE user_course_id = ${enrollment.enrollment_id}
        ORDER BY installment_number
      `
    }

    // Calculate remaining balance
    const totalFee = Number(enrollment.total_fee) || 0
    const paidAmount = Number(enrollment.paid_amount) || 0
    const remainingBalance = totalFee - paidAmount

    const studentData = {
      id: enrollment.id,
      name: enrollment.name,
      email: enrollment.email,
      phone: enrollment.phone,
      currency: enrollment.currency || 'USD',
      enrollment_date: enrollment.enrollment_date,
      status: enrollment.status,
      enrollment_id: enrollment.enrollment_id,
      fee_type: enrollment.fee_type || null, // No default fee type - teacher must select
      fee_structure: {
        total_fee: totalFee,
        monthly_amount: Number(enrollment.monthly_amount) || 0,
        installments_count: Number(enrollment.installments_count) || 1,
        paid_amount: paidAmount,
        remaining_balance: remainingBalance,
        due_date: enrollment.due_date,
        status: remainingBalance === 0 ? 'paid' : remainingBalance === totalFee ? 'unpaid' : 'partial'
      },
      installments: installments.map(inst => ({
        id: inst.id,
        installment_number: inst.installment_number,
        amount: Number(inst.amount),
        due_date: inst.due_date,
        status: inst.status,
        paid_date: inst.paid_date
      })),
      payment_history: payments.map(p => ({
        id: p.id,
        amount: Number(p.amount),
        payment_date: p.payment_date,
        payment_method: p.payment_method,
        reference: p.reference,
        notes: p.notes,
        created_by: p.created_by
      }))
    }

    return NextResponse.json({ 
      student: studentData,
      course 
    })

  } catch (error) {
    console.error('Error fetching student details:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}