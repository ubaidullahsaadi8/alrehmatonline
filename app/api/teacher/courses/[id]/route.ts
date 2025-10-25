import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getSession } from '@/lib/session'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getSession()
    
    if (!user || user.user_type !== 'instructor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const courseId = params.id

    // Verify instructor has access to this course
    const courseAccess = await sql`
      SELECT id FROM course_instructors
      WHERE course_id = ${courseId}
      AND instructor_id = ${user.id}
      AND status = 'active'
      LIMIT 1
    `

    if (courseAccess.length === 0) {
      return NextResponse.json({ error: 'Course not found or access denied' }, { status: 404 })
    }

    // Get course details
    const courseResult = await sql`
      SELECT 
        c.*,
        COUNT(DISTINCT sc.student_id) as student_count
      FROM courses c
      LEFT JOIN student_courses sc ON c.id = sc.course_id AND sc.status = 'active'
      WHERE c.id = ${courseId}
      GROUP BY c.id
    `

    if (!courseResult || courseResult.length === 0) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    const course = courseResult[0]

    // Get enrolled students
    const students = await sql`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.phone,
        sc.enrollment_date,
        sc.status,
        sc.id as enrollment_id,
        sc.fee_type,
        sc.total_fee as total_amount,
        sc.monthly_amount,
        sc.currency,
        sc.status as fee_status,
        CASE 
          WHEN sc.paid_amount >= sc.total_fee THEN 'paid'
          WHEN sc.due_date < CURRENT_DATE THEN 'overdue'
          ELSE 'pending'
        END as payment_status
      FROM users u
      INNER JOIN student_courses sc ON u.id = sc.student_id
      WHERE sc.course_id = ${courseId}
      ORDER BY sc.enrollment_date DESC
    `

    const courseWithStudents = {
      ...course,
      students: students.map(student => {
        // Check if fee plan exists:
        // - For monthly: fee_type should be set
        // - For complete/full_course: total_amount should be set
        const hasFee = student.fee_type != null && (
          student.fee_type === 'monthly' || 
          (student.total_amount != null && student.total_amount > 0)
        )
        
        return {
          id: student.id,
          name: student.name,
          email: student.email,
          phone: student.phone,
          enrollment_date: student.enrollment_date,
          status: student.status,
          fee_plan: hasFee ? {
            id: student.enrollment_id,
            fee_type: student.fee_type,
            total_amount: Number(student.total_amount) || 0,
            monthly_amount: student.monthly_amount != null ? Number(student.monthly_amount) : null,
            currency: student.currency || 'USD',
            status: student.fee_status
          } : null, // No fee plan if not properly configured
          payment_status: hasFee ? student.payment_status : 'no_plan'
        }
      })
    }

    return NextResponse.json({ course: courseWithStudents })

  } catch (error: any) {
    console.error('Error fetching course details:', error)
    console.error('Error message:', error?.message)
    console.error('Error stack:', error?.stack)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error?.message 
    }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const courseId = params.id
    const body = await request.json()
    
    // Update course details
    const updatedCourse = await sql`
      UPDATE courses 
      SET 
        title = ${body.title || ''},
        description = ${body.description || ''},
        level = ${body.level || ''},
        category = ${body.category || ''},
        duration = ${body.duration || ''},
        status = ${body.status || 'active'},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${courseId}
      RETURNING *
    `

    return NextResponse.json({ course: updatedCourse[0] })

  } catch (error) {
    console.error('Error updating course:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}