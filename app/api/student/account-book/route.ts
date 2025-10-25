import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getSession } from '@/lib/session'

export async function GET(request: NextRequest) {
  try {
    const user = await getSession()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get student's currency first
    const studentInfo = await sql`
      SELECT currency FROM users WHERE id = ${user.id} LIMIT 1
    `
    const studentCurrency = studentInfo[0]?.currency || 'USD'

    // Get all enrolled courses for the student
    const enrolledCourses = await sql`
      SELECT 
        c.id as course_id,
        c.title as course_title,
        c.instructor_id,
        u.name as instructor_name,
        u.email as instructor_email,
        sc.enrollment_date as enrollment_date,
        sc.id as enrollment_id
      FROM student_courses sc
      JOIN courses c ON sc.course_id = c.id
      JOIN users u ON c.instructor_id = u.id
      WHERE sc.student_id = ${user.id}
      ORDER BY sc.enrollment_date DESC
    `

    // For each course, get fee plan, installments, monthly fees, and bank details
    const coursesWithFees = await Promise.all(
      enrolledCourses.map(async (course) => {
        // Get fee plan from student_courses
        const feePlans = await sql`
          SELECT 
            fee_type,
            total_fee as total_amount,
            monthly_amount,
            installments_count,
            payment_instructions,
            created_at
          FROM student_courses
          WHERE id = ${course.enrollment_id}
          AND fee_type IS NOT NULL
        `

        let feePlan = null
        if (feePlans.length > 0) {
          feePlan = {
            ...feePlans[0],
            currency: studentCurrency  // Use student's currency
          }
        }

        // Get bank details for the course
        const bankDetailsResult = await sql`
          SELECT 
            bank_name,
            account_title,
            account_number,
            iban,
            branch_code,
            payment_instructions
          FROM course_bank_details
          WHERE course_id = ${course.course_id}
          LIMIT 1
        `
        
        const bankDetails = bankDetailsResult.length > 0 ? bankDetailsResult[0] : null

        // Get installments if fee plan exists and is full course type
        let installments: any[] = []
        if (feePlan && (feePlan.fee_type === 'full_course' || feePlan.fee_type === 'complete')) {
          installments = await sql`
            SELECT 
              id,
              installment_number,
              amount,
              due_date,
              status,
              paid_date
            FROM course_installments
            WHERE user_course_id = ${course.enrollment_id}
            ORDER BY installment_number ASC
          `
        }

        // Get monthly fees if fee plan exists and is monthly type
        let monthlyFees: any[] = []
        if (feePlan && feePlan.fee_type === 'monthly') {
          monthlyFees = await sql`
            SELECT 
              id,
              month,
              year,
              amount,
              due_date,
              status,
              paid_date
            FROM monthly_fees
            WHERE user_course_id = ${course.enrollment_id}
            ORDER BY year DESC, 
              CASE month
                WHEN 'january' THEN 1
                WHEN 'february' THEN 2
                WHEN 'march' THEN 3
                WHEN 'april' THEN 4
                WHEN 'may' THEN 5
                WHEN 'june' THEN 6
                WHEN 'july' THEN 7
                WHEN 'august' THEN 8
                WHEN 'september' THEN 9
                WHEN 'october' THEN 10
                WHEN 'november' THEN 11
                WHEN 'december' THEN 12
              END DESC
          `
        }

        return {
          course_id: course.course_id,
          course_title: course.course_title,
          instructor_name: course.instructor_name,
          instructor_email: course.instructor_email,
          enrollment_date: course.enrollment_date,
          fee_plan: feePlan,
          bank_details: bankDetails,
          installments: installments.map(i => ({
            ...i,
            amount: Number(i.amount),
          })),
          monthly_fees: monthlyFees.map(f => ({
            ...f,
            amount: Number(f.amount),
          })),
        }
      })
    )

    return NextResponse.json({
      success: true,
      courses: coursesWithFees,
    })

  } catch (error: any) {
    console.error('Error fetching account book:', error)
    return NextResponse.json(
      { error: 'Failed to fetch account book', details: error.message },
      { status: 500 }
    )
  }
}
