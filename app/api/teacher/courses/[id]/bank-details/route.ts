import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getSession } from '@/lib/session'

// GET - Fetch bank details for a course
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSession()
    if (!user || user.user_type !== 'instructor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: courseId } = await params

    // Check if instructor has access to this course
    const courseAccess = await sql`
      SELECT id FROM course_instructors 
      WHERE course_id = ${courseId} AND instructor_id = ${user.id} AND status = 'active'
      LIMIT 1
    `

    if (courseAccess.length === 0) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Fetch bank details
    const bankDetails = await sql`
      SELECT * FROM course_bank_details
      WHERE course_id = ${courseId}
      LIMIT 1
    `

    if (bankDetails.length === 0) {
      return NextResponse.json({ bankDetails: null })
    }

    return NextResponse.json({ bankDetails: bankDetails[0] })

  } catch (error) {
    console.error('Error fetching bank details:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create bank details for a course
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSession()
    if (!user || user.user_type !== 'instructor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: courseId } = await params
    const body = await request.json()
    const { bank_name, account_title, account_number, iban, branch_code, payment_instructions } = body

    // Check if instructor has access to this course
    const courseAccess = await sql`
      SELECT id FROM course_instructors 
      WHERE course_id = ${courseId} AND instructor_id = ${user.id} AND status = 'active'
      LIMIT 1
    `

    if (courseAccess.length === 0) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Insert or update bank details
    const result = await sql`
      INSERT INTO course_bank_details (
        course_id,
        bank_name,
        account_title,
        account_number,
        iban,
        branch_code,
        payment_instructions,
        updated_at
      ) VALUES (
        ${courseId},
        ${bank_name || null},
        ${account_title || null},
        ${account_number || null},
        ${iban || null},
        ${branch_code || null},
        ${payment_instructions || null},
        NOW()
      )
      ON CONFLICT (course_id) 
      DO UPDATE SET
        bank_name = EXCLUDED.bank_name,
        account_title = EXCLUDED.account_title,
        account_number = EXCLUDED.account_number,
        iban = EXCLUDED.iban,
        branch_code = EXCLUDED.branch_code,
        payment_instructions = EXCLUDED.payment_instructions,
        updated_at = NOW()
      RETURNING *
    `

    return NextResponse.json({ 
      message: 'Bank details saved successfully',
      bankDetails: result[0]
    })

  } catch (error) {
    console.error('Error saving bank details:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update bank details (alias for POST)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return POST(request, { params })
}
