import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"


export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string, notificationId: string } }
) {
  try {
    
    const adminUser = await getSession()
    
    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = await Promise.resolve(params.id)
    const notificationId = await Promise.resolve(params.notificationId)
    
    
    const notificationCheck = await sql`
      SELECT id FROM notifications 
      WHERE id = ${notificationId} AND user_id = ${userId}
    `

    if (notificationCheck.length === 0) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 }
      )
    }

    // Mark notification as read
    await sql`
      UPDATE notifications
      SET 
        read = true,
        updated_at = NOW()
      WHERE id = ${notificationId}
    `

    return NextResponse.json({ 
      success: true,
      message: "Notification marked as read"
    })
  } catch (error) {
    console.error("Error updating notification:", error)
    return NextResponse.json(
      { error: "Failed to update notification" },
      { status: 500 }
    )
  }
}

// Delete notification
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string, notificationId: string } }
) {
  try {
    // Check for admin authorization
    const adminUser = await getSession()
    
    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = await Promise.resolve(params.id)
    const notificationId = await Promise.resolve(params.notificationId)
    
    // Check if notification exists and belongs to the user
    const notificationCheck = await sql`
      SELECT id FROM notifications 
      WHERE id = ${notificationId} AND user_id = ${userId}
    `

    if (notificationCheck.length === 0) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 }
      )
    }

    // Delete notification
    await sql`
      DELETE FROM notifications
      WHERE id = ${notificationId}
    `

    return NextResponse.json({ 
      success: true,
      message: "Notification deleted successfully"
    })
  } catch (error) {
    console.error("Error deleting notification:", error)
    return NextResponse.json(
      { error: "Failed to delete notification" },
      { status: 500 }
    )
  }
}
