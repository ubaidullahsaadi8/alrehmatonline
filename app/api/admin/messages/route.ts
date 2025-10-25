import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"


export async function GET(req: NextRequest) {
  try {
    
    const user = await getSession()
    
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    
    const messages = await sql`
      SELECT 
        id, 
        name, 
        email,
        phone,
        subject,
        message,
        created_at as "createdAt",
        read
      FROM contact_messages 
      ORDER BY created_at DESC
    `

    return NextResponse.json(messages)
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    )
  }
}

// Delete a message
export async function DELETE(req: NextRequest) {
  try {
    // Check for admin authorization
    const user = await getSession()
    
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get message ID from request
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { error: "Message ID is required" },
        { status: 400 }
      )
    }

    // Delete the message
    await sql`DELETE FROM contact_messages WHERE id = ${id}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting message:", error)
    return NextResponse.json(
      { error: "Failed to delete message" },
      { status: 500 }
    )
  }
}
