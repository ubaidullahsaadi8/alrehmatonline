import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getSession } from '@/lib/session'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getSession()
    
    if (!user || !user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const courseId = params.id

    // Verify student is enrolled in this course
    const enrollment = await sql`
      SELECT id FROM student_courses
      WHERE student_id = ${user.id} AND course_id = ${courseId}
    `

    if (enrollment.length === 0) {
      return NextResponse.json({ error: 'Not enrolled in this course' }, { status: 403 })
    }

    // Get all notifications for this course
    const notifications = await sql`
      SELECT 
        cn.id,
        cn.message,
        cn.created_at,
        u.id as instructor_id,
        u.name as instructor_name
      FROM course_notifications cn
      JOIN users u ON cn.instructor_id = u.id
      WHERE cn.course_id = ${courseId}
      ORDER BY cn.created_at DESC
    `

    const formattedNotifications = notifications.map(notif => ({
      id: notif.id,
      message: notif.message,
      created_at: notif.created_at,
      instructor: {
        id: notif.instructor_id,
        name: notif.instructor_name
      }
    }))

    return NextResponse.json({ notifications: formattedNotifications })

  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
