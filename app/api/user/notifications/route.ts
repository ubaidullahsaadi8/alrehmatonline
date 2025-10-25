import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"


export async function GET(req: NextRequest) {
  try {
    
    const user = await getSession()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const url = new URL(req.url)
    const limit = url.searchParams.get("limit")

    // Get admin/teacher notifications
    console.log('Fetching notifications for user:', user.id)
    console.log('User details:', { id: user.id, email: user.email, role: user.role })
    
    const adminNotifications = await sql`
      SELECT 
        n.id,
        n.title,
        n.message,
        n.type,
        n.read,
        n.created_at,
        n.link,
        n.created_by,
        u.name as sender_name,
        u.role as sender_role
      FROM notifications n
      LEFT JOIN users u ON n.created_by = u.id
      WHERE n.user_id = ${user.id}
      ORDER BY n.created_at DESC
    `
    
    console.log('Admin notifications found:', adminNotifications.length)
    console.log('Admin notifications:', JSON.stringify(adminNotifications, null, 2))

    // Get course notifications (if user is student)
    let courseNotifications: any[] = []
    if (user.user_type === 'student' || user.role === 'student') {
      // Get enrolled courses
      const enrolledCourses = await sql`
        SELECT course_id FROM student_courses
        WHERE student_id = ${user.id}
      `

      const courseIds = enrolledCourses.map((c: any) => c.course_id)

      if (courseIds.length > 0) {
        // Get course notifications with read status
        courseNotifications = await sql`
          SELECT 
            cn.id,
            cn.message as message,
            'course' as type,
            CASE WHEN nr.id IS NOT NULL THEN true ELSE false END as read,
            cn.created_at,
            c.title as course_title,
            c.id as course_id,
            u.name as instructor_name
          FROM course_notifications cn
          JOIN courses c ON cn.course_id = c.id
          JOIN users u ON cn.instructor_id = u.id
          LEFT JOIN notification_reads nr ON cn.id = nr.notification_id AND nr.student_id = ${user.id}
          WHERE cn.course_id = ANY(${courseIds})
          ORDER BY cn.created_at DESC
        `

        // Format course notifications to match admin notification structure
        courseNotifications = courseNotifications.map((n: any) => ({
          id: n.id,
          title: `${n.course_title} - ${n.instructor_name}`,
          message: n.message,
          type: n.type,
          read: n.read,
          created_at: n.created_at,
          link: `/student/courses/${n.course_id}`
        }))
      }
    }

    // Combine both types of notifications
    let allNotifications = [...adminNotifications, ...courseNotifications]

    // Sort by date (newest first)
    allNotifications.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

    // Apply limit if specified
    if (limit) {
      allNotifications = allNotifications.slice(0, parseInt(limit))
    }
    
    return NextResponse.json(allNotifications)
  } catch (error) {
    console.error("Error fetching user notifications:", error)
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    )
  }
}
