import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'



export async function GET(request: NextRequest) {
  try {
    // In a real app, get studentId from authentication
    // For now, get the first student
    const [student] = await sql`
      SELECT id FROM users WHERE user_type = 'student' LIMIT 1
    `

    if (!student) {
      return NextResponse.json({ fee_plans: [] })
    }

    const studentId = student.id

    // Get fee plans with course details and payment records
    const feePlans = await sql`
      SELECT 
        fp.id,
        fp.course_id,
        c.title as course_title,
        fp.fee_type,
        fp.total_amount,
        fp.monthly_amount,
        fp.installments_count,
        fp.installment_amount,
        fp.currency,
        fp.status,
        fp.created_at,
        fp.payment_instructions,
        bd.id as bank_id,
        bd.bank_name,
        bd.account_holder_name,
        bd.account_number,
        bd.routing_number,
        bd.swift_code,
        bd.iban,
        bd.bank_address,
        bd.currency as bank_currency
      FROM fee_plans fp
      INNER JOIN courses c ON fp.course_id = c.id
      LEFT JOIN bank_details bd ON fp.bank_details_id = bd.id
      WHERE fp.student_id = ${studentId}
      ORDER BY fp.created_at DESC
    `

    // Get payment records for each fee plan
    const feePlansWithPayments = await Promise.all(
      feePlans.map(async (plan) => {
        const paymentRecords = await sql`
          SELECT 
            id,
            amount,
            payment_type,
            status,
            due_date,
            paid_date,
            notes,
            created_at
          FROM payment_records
          WHERE fee_plan_id = ${plan.id}
          ORDER BY due_date DESC
        `

        // Calculate paid and remaining amounts
        const paidAmount = paymentRecords
          .filter(p => p.status === 'paid')
          .reduce((sum, p) => sum + Number(p.amount), 0)
        
        const remainingAmount = Number(plan.total_amount) - paidAmount

        return {
          ...plan,
          total_amount: Number(plan.total_amount),
          monthly_amount: plan.monthly_amount ? Number(plan.monthly_amount) : null,
          installment_amount: plan.installment_amount ? Number(plan.installment_amount) : null,
          payment_instructions: plan.payment_instructions,
          bank_details: plan.bank_id ? {
            id: plan.bank_id,
            bank_name: plan.bank_name,
            account_holder_name: plan.account_holder_name,
            account_number: plan.account_number,
            routing_number: plan.routing_number,
            swift_code: plan.swift_code,
            iban: plan.iban,
            bank_address: plan.bank_address,
            currency: plan.bank_currency
          } : null,
          payment_records: paymentRecords.map(pr => ({
            ...pr,
            amount: Number(pr.amount)
          })),
          paid_amount: paidAmount,
          remaining_amount: remainingAmount
        }
      })
    )

    return NextResponse.json({ fee_plans: feePlansWithPayments })

  } catch (error) {
    console.error('Error fetching student fees:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}