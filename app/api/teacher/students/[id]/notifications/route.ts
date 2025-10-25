import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"

// Send notification to a specific student
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check for teacher authorization
    const teacher = await getSession()
    
    if (!teacher || (teacher.role !== "instructor" && teacher.user_type !== "instructor")) {
      return NextResponse.json({ 
        error: "Unauthorized - Instructor access required"
      }, { status: 401 })
    }

    const studentId = await Promise.resolve(params.id)
    
    // Get data from request
    const { title, message, type = 'info' } = await req.json()

    // Validate required fields
    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      )
    }

    // Verify student exists
    const studentCheck = await sql`
      SELECT id FROM users WHERE id = ${studentId} LIMIT 1
    `

    if (studentCheck.length === 0) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      )
    }
    
    // Create unique ID for notification
    const notificationId = `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    
    console.log('Creating notification:', {
      notificationId,
      studentId,
      teacherId: teacher.id,
      message,
      title
    })
    
    // Create the notification
    const result = await sql`
      INSERT INTO notifications (
        id,
        user_id,
        title,
        message,
        type,
        created_by
      ) VALUES (
        ${notificationId},
        ${studentId},
        ${title || 'Notification from Teacher'},
        ${message},
        ${type},
        ${teacher.id}
      )
      RETURNING *
    `
    
    console.log('Notification created:', result)

    return NextResponse.json({ 
      success: true,
      notificationId,
      message: "Notification sent successfully",
      debug: result[0]
    })
  } catch (error) {
    console.error("Error sending notification:", error)
    return NextResponse.json(
      { error: "Failed to send notification" },
      { status: 500 }
    )
  }
}
