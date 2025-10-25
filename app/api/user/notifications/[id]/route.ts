import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"


export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    
    const user = await getSession()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const notificationId = await Promise.resolve(params.id)
    
    // Check if it's an admin notification
    const adminNotificationCheck = await sql`
      SELECT id FROM notifications 
      WHERE id = ${notificationId} AND user_id = ${user.id}
    `

    if (adminNotificationCheck.length > 0) {
      // Mark admin notification as read
      await sql`
        UPDATE notifications
        SET read = true
        WHERE id = ${notificationId} AND user_id = ${user.id}
      `
      
      return NextResponse.json({ 
        success: true,
        message: "Notification marked as read"
      })
    }

    // Check if it's a course notification (for students)
    if (user.user_type === 'student' || user.role === 'student') {
      const courseNotificationCheck = await sql`
        SELECT cn.id 
        FROM course_notifications cn
        JOIN student_courses sc ON cn.course_id = sc.course_id
        WHERE cn.id = ${notificationId} AND sc.student_id = ${user.id}
      `

      if (courseNotificationCheck.length > 0) {
        // Mark course notification as read
        await sql`
          INSERT INTO notification_reads (notification_id, student_id)
          VALUES (${notificationId}, ${user.id})
          ON CONFLICT (notification_id, student_id) DO NOTHING
        `
        
        return NextResponse.json({ 
          success: true,
          message: "Course notification marked as read"
        })
      }
    }

    return NextResponse.json(
      { error: "Notification not found" },
      { status: 404 }
    )
  } catch (error) {
    console.error("Error updating notification:", error)
    return NextResponse.json(
      { error: "Failed to update notification" },
      { status: 500 }
    )
  }
}
