import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getSession } from '@/lib/session'



export async function GET(request: NextRequest) {
  try {
    const user = await getSession()
    
    if (!user || !user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all courses student is enrolled in
    const enrolledCourses = await sql`
      SELECT course_id FROM student_courses
      WHERE student_id = ${user.id}
    `

    const courseIds = enrolledCourses.map(c => c.course_id)

    // Get course notifications (from instructors)
    let courseNotifications = []
    if (courseIds.length > 0) {
      courseNotifications = await sql`
        SELECT 
          cn.id,
          cn.message,
          cn.created_at,
          cn.course_id,
          c.title as course_title,
          u.id as instructor_id,
          u.name as instructor_name,
          'instructor' as notification_type,
          CASE WHEN nr.id IS NOT NULL THEN true ELSE false END as is_read,
          nr.read_at
        FROM course_notifications cn
        JOIN courses c ON cn.course_id = c.id
        JOIN users u ON cn.instructor_id = u.id
        LEFT JOIN notification_reads nr ON cn.id = nr.notification_id AND nr.student_id = ${user.id}
        WHERE cn.course_id = ANY(${courseIds})
        ORDER BY cn.created_at DESC
      `
    }

    // Get admin notifications
    const adminNotifications = await sql`
      SELECT 
        n.id,
        n.message,
        n.title,
        n.created_at,
        n.read,
        'admin' as notification_type,
        u.name as admin_name
      FROM notifications n
      LEFT JOIN users u ON n.created_by = u.id
      WHERE n.user_id = ${user.id}
      ORDER BY n.created_at DESC
    `

    // Combine and format all notifications
    const allNotifications = [
      ...courseNotifications.map(n => ({
        id: n.id,
        message: n.message,
        title: n.title || null,
        created_at: n.created_at,
        is_read: n.is_read,
        read_at: n.read_at,
        type: 'course',
        course: {
          id: n.course_id,
          title: n.course_title
        },
        instructor: {
          id: n.instructor_id,
          name: n.instructor_name
        }
      })),
      ...adminNotifications.map(n => ({
        id: n.id,
        message: n.message,
        title: n.title,
        created_at: n.created_at,
        is_read: n.read,
        read_at: null,
        type: 'admin',
        admin: {
          name: n.admin_name || 'Administrator'
        }
      }))
    ]

    // Sort by date (newest first)
    allNotifications.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

    const unreadCount = allNotifications.filter(n => !n.is_read).length

    return NextResponse.json({ 
      notifications: allNotifications,
      total: allNotifications.length,
      unread: unreadCount
    })

  } catch (error) {
    console.error('Error fetching student notifications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notifications' }, 
      { status: 500 }
    )
  }
}