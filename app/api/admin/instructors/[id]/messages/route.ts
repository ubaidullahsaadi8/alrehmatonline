import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const instructorId = params.id
    console.log(`Sending message to instructor: ${instructorId}`)
    
    
    const user = await getSession()
    if (!user || user.role !== "admin") {
      console.log("Unauthorized attempt to send message to instructor")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const body = await req.json()
    const { title, message, type = "info" } = body
    
    if (!title || !message) {
      return NextResponse.json(
        { error: "Title and message are required" }, 
        { status: 400 }
      )
    }
    
    
    const notificationId = crypto.randomUUID()
    const notification = await sql`
      INSERT INTO notifications (
        id, 
        user_id, 
        title, 
        message, 
        type, 
        read, 
        created_at, 
        created_by
      )
      VALUES (
        ${notificationId},
        ${instructorId},
        ${title},
        ${message},
        ${type},
        false,
        CURRENT_TIMESTAMP,
        ${user.id}
      )
      RETURNING id, title, message, type, created_at
    `
    
    if (!notification || notification.length === 0) {
      return NextResponse.json(
        { error: "Failed to send message to instructor" }, 
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: "Message sent successfully to instructor",
      notification: notification[0]
    })
  } catch (error) {
    console.error("Error sending message to instructor:", error)
    return NextResponse.json(
      { error: "Failed to send message to instructor" }, 
      { status: 500 }
    )
  }
}
