import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"


export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    
    const adminUser = await getSession()
    
    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = await Promise.resolve(params.id)
    
    
    const notifications = await sql`
      SELECT 
        n.id,
        n.title,
        n.message,
        n.type,
        n.read,
        n.created_at,
        u.name as created_by_name
      FROM notifications n
      LEFT JOIN users u ON n.created_by = u.id
      WHERE n.user_id = ${userId}
      ORDER BY n.created_at DESC
    `
    
    // Ensure we're returning an array
    const notificationsArray = Array.isArray(notifications) ? notifications : []
    
    return NextResponse.json(notificationsArray)
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    )
  }
}

// Send a new notification to a user
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check for admin authorization
    const adminUser = await getSession()
    
    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = await Promise.resolve(params.id)
    
    // Get data from request
    const { title, message, type = 'info' } = await req.json()

    // Validate required fields
    if (!title || !message) {
      return NextResponse.json(
        { error: "Title and message are required" },
        { status: 400 }
      )
    }
    
    // Create unique ID for notification
    const notificationId = `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    
    // Create the notification
    await sql`
      INSERT INTO notifications (
        id,
        user_id,
        title,
        message,
        type,
        created_by
      ) VALUES (
        ${notificationId},
        ${userId},
        ${title},
        ${message},
        ${type},
        ${adminUser.id}
      )
    `

    return NextResponse.json({ 
      success: true,
      notificationId,
      message: "Notification sent successfully"
    })
  } catch (error) {
    console.error("Error sending notification:", error)
    return NextResponse.json(
      { error: "Failed to send notification" },
      { status: 500 }
    )
  }
}
