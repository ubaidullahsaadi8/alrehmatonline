import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getSession } from '@/lib/session'

// POST/PUT - Update student's total fee
export async function POST(
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
    const body = await request.json()
    
    console.log('Raw request body:', body)
    
    // Map old field names to new ones for compatibility
    const fee_type = body.fee_type === 'full_course' ? 'complete' : body.fee_type
    const total_fee = body.total_amount || body.total_fee
    const monthly_amount = body.monthly_amount
    const installments_count = body.installments_count
    const due_date = body.due_date
    const custom_installments = body.custom_installments // Array of custom installments with amount and due_date
    
    console.log('Parsed values:', { fee_type, total_fee, monthly_amount, installments_count, due_date, custom_installments })

    // Check instructor access
    const courseAccess = await sql`
      SELECT id FROM course_instructors 
      WHERE course_id = ${courseId} AND instructor_id = ${user.id} AND status = 'active'
      LIMIT 1
    `

    if (courseAccess.length === 0) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Get enrollment ID and student's currency
    const enrollment = await sql`
      SELECT sc.id, u.currency 
      FROM student_courses sc
      INNER JOIN users u ON sc.student_id = u.id
      WHERE sc.student_id = ${studentId} AND sc.course_id = ${courseId}
      LIMIT 1
    `

    if (enrollment.length === 0) {
      return NextResponse.json({ error: 'Student enrollment not found' }, { status: 404 })
    }

    const userCourseId = enrollment[0].id
    const studentCurrency = enrollment[0].currency || 'USD'
    
    console.log('Student currency:', studentCurrency)

    // Update the student_courses fee and reset paid_amount
    const result = await sql`
      UPDATE student_courses
      SET 
        fee_type = ${fee_type},
        total_fee = ${total_fee || 0},
        monthly_amount = ${fee_type === 'monthly' ? (monthly_amount || 0) : 0},
        installments_count = ${fee_type === 'complete' ? (installments_count || 1) : 1},
        due_date = ${due_date || null},
        paid_amount = 0,
        updated_at = NOW()
      WHERE student_id = ${studentId} AND course_id = ${courseId}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: 'Failed to update fee' }, { status: 500 })
    }

    // Always delete old installments and monthly fees when updating fee plan
    await sql`
      DELETE FROM course_installments
      WHERE user_course_id = ${userCourseId}
    `
    
    await sql`
      DELETE FROM monthly_fees
      WHERE user_course_id = ${userCourseId}
    `
    
    // Also delete payment history since fee structure changed
    await sql`
      DELETE FROM course_payments
      WHERE user_course_id = ${userCourseId}
    `

    // If complete fee with installments, create installment schedule
    if (fee_type === 'complete' && installments_count && total_fee) {

      // Create new installment schedule with custom amounts and dates if provided
      if (custom_installments && Array.isArray(custom_installments) && custom_installments.length > 0) {
        // Use custom installments
        for (const installment of custom_installments) {
          await sql`
            INSERT INTO course_installments (
              user_course_id,
              installment_number,
              amount,
              due_date,
              status
            )
            VALUES (
              ${userCourseId},
              ${installment.installment_number},
              ${parseFloat(installment.amount)},
              ${installment.due_date},
              'pending'
            )
          `
        }
      } else {
        // Auto-generate equal installments (old behavior)
        const installmentAmount = parseFloat(total_fee) / parseInt(installments_count)
        const baseDate = due_date ? new Date(due_date) : new Date()

        for (let i = 1; i <= parseInt(installments_count); i++) {
          const dueDate = new Date(baseDate)
          dueDate.setMonth(dueDate.getMonth() + i - 1)

          await sql`
            INSERT INTO course_installments (
              user_course_id,
              installment_number,
              amount,
              due_date,
              status
            )
            VALUES (
              ${userCourseId},
              ${i},
              ${installmentAmount},
              ${dueDate.toISOString().split('T')[0]},
              'pending'
            )
          `
        }
      }
    }

    return NextResponse.json({ 
      message: 'Fee plan created successfully',
      enrollment: result[0]
    })

  } catch (error) {
    console.error('Error updating fee:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string, studentId: string }> }
) {
  return POST(request, { params })
}