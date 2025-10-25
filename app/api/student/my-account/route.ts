import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getSession } from '@/lib/session'

export async function GET(request: NextRequest) {
  try {
    const user = await getSession()
    if (!user || user.user_type !== 'student') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch all enrolled courses with fee plans
    const enrollments = await sql`
      SELECT 
        e.id as enrollment_id,
        e.course_id,
        e.status as enrollment_status,
        e.enrollment_date,
        c.title as course_title,
        c.description as course_description,
        c.image as course_image,
        c.category,
        c.level,
        fp.id as fee_plan_id,
        fp.fee_type,
        fp.total_fee,
        fp.monthly_amount,
        fp.paid_amount,
        fp.currency,
        fp.status as fee_status,
        fp.installments_count,
        cbd.bank_name,
        cbd.account_title,
        cbd.account_number,
        cbd.iban,
        cbd.branch_code,
        cbd.payment_instructions
      FROM enrollments e
      INNER JOIN courses c ON e.course_id = c.id
      LEFT JOIN fee_plans fp ON e.id = fp.enrollment_id
      LEFT JOIN course_bank_details cbd ON c.id = cbd.course_id
      WHERE e.student_id = ${user.id}
      ORDER BY e.enrollment_date DESC
    `

    // For each enrollment, fetch installments or monthly fees
    const enrollmentsWithDetails = await Promise.all(
      enrollments.map(async (enrollment) => {
        let feeDetails = []

        if (enrollment.fee_plan_id) {
          if (enrollment.fee_type === 'monthly') {
            // Fetch monthly fees
            const monthlyFees = await sql`
              SELECT 
                id,
                month,
                year,
                amount,
                due_date,
                status,
                paid_date,
                created_at
              FROM monthly_fees
              WHERE fee_plan_id = ${enrollment.fee_plan_id}
              ORDER BY year DESC, month DESC
            `
            feeDetails = monthlyFees
          } else {
            // Fetch installments
            const installments = await sql`
              SELECT 
                id,
                installment_number,
                amount,
                due_date,
                status,
                paid_date,
                created_at
              FROM installments
              WHERE fee_plan_id = ${enrollment.fee_plan_id}
              ORDER BY installment_number ASC
            `
            feeDetails = installments
          }
        }

        return {
          ...enrollment,
          fee_details: feeDetails
        }
      })
    )

    return NextResponse.json({ enrollments: enrollmentsWithDetails })

  } catch (error) {
    console.error('Error fetching student account:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
