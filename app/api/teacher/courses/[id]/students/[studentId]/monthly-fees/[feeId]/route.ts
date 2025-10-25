import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getSession } from '@/lib/session'

// PUT - Update monthly fee status
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string, studentId: string, feeId: string }> }
) {
  try {
    const user = await getSession()
    if (!user || user.user_type !== 'instructor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: courseId, studentId, feeId } = await params
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

    // Verify fee belongs to this student and course
    const feeCheck = await sql`
      SELECT mf.id
      FROM monthly_fees mf
      INNER JOIN student_courses sc ON mf.user_course_id = sc.id
      WHERE mf.id = ${feeId} 
        AND sc.student_id = ${studentId} 
        AND sc.course_id = ${courseId}
      LIMIT 1
    `

    if (feeCheck.length === 0) {
      return NextResponse.json({ error: 'Monthly fee not found' }, { status: 404 })
    }

    // Update monthly fee status
    const result = await sql`
      UPDATE monthly_fees
      SET 
        status = ${status},
        paid_date = ${paid_date || null}
      WHERE id = ${feeId}
      RETURNING *
    `

    return NextResponse.json({ 
      message: 'Monthly fee status updated successfully',
      fee: result[0]
    })

  } catch (error) {
    console.error('Error updating monthly fee status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
