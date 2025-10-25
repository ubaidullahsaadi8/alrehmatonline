import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getSession } from '@/lib/session'

// GET - Fetch all monthly fees for a student
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string, studentId: string }> }
) {
  try {
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

    // Get enrollment ID
    const enrollment = await sql`
      SELECT id FROM student_courses
      WHERE student_id = ${studentId} AND course_id = ${courseId}
      LIMIT 1
    `

    if (enrollment.length === 0) {
      return NextResponse.json({ error: 'Student enrollment not found' }, { status: 404 })
    }

    const userCourseId = enrollment[0].id

    // Fetch all monthly fees
    const fees = await sql`
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
      WHERE user_course_id = ${userCourseId}
      ORDER BY year DESC, 
        CASE month
          WHEN 'january' THEN 1 WHEN 'february' THEN 2 WHEN 'march' THEN 3
          WHEN 'april' THEN 4 WHEN 'may' THEN 5 WHEN 'june' THEN 6
          WHEN 'july' THEN 7 WHEN 'august' THEN 8 WHEN 'september' THEN 9
          WHEN 'october' THEN 10 WHEN 'november' THEN 11 WHEN 'december' THEN 12
        END DESC
    `

    return NextResponse.json({ fees })

  } catch (error) {
    console.error('Error fetching monthly fees:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Add new monthly fee
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string, studentId: string }> }
) {
  try {
    const user = await getSession()
    if (!user || user.user_type !== 'instructor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: courseId, studentId } = await params
    const { month, year, amount, due_date } = await request.json()

    // Validate required fields
    if (!month || !year || !amount || !due_date) {
      return NextResponse.json({ 
        error: 'Missing required fields: month, year, amount, and due_date are required' 
      }, { status: 400 })
    }

    // Check instructor access
    const courseAccess = await sql`
      SELECT id FROM course_instructors 
      WHERE course_id = ${courseId} AND instructor_id = ${user.id} AND status = 'active'
      LIMIT 1
    `

    if (courseAccess.length === 0) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Get enrollment ID
    const enrollment = await sql`
      SELECT id FROM student_courses
      WHERE student_id = ${studentId} AND course_id = ${courseId}
      LIMIT 1
    `

    if (enrollment.length === 0) {
      return NextResponse.json({ error: 'Student enrollment not found' }, { status: 404 })
    }

    const userCourseId = enrollment[0].id

    // Check if fee already exists for this month/year
    const existingFee = await sql`
      SELECT id FROM monthly_fees
      WHERE user_course_id = ${userCourseId} 
        AND month = ${month}
        AND year = ${year}
      LIMIT 1
    `

    if (existingFee.length > 0) {
      return NextResponse.json({ error: 'Fee already exists for this month and year' }, { status: 400 })
    }

    // Insert new monthly fee
    const result = await sql`
      INSERT INTO monthly_fees (
        user_course_id,
        month,
        year,
        amount,
        due_date,
        status
      )
      VALUES (
        ${userCourseId},
        ${month},
        ${year},
        ${parseFloat(amount)},
        ${due_date},
        'pending'
      )
      RETURNING *
    `

    return NextResponse.json({ 
      message: 'Monthly fee added successfully',
      fee: result[0]
    })

  } catch (error) {
    console.error('Error adding monthly fee:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
