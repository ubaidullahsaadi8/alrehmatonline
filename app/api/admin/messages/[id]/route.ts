import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    
    const user = await getSession()
    
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = params.id

    
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
      WHERE id = ${id}
    `

    if (messages.length === 0) {
      return NextResponse.json(
        { error: "Message not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(messages[0])
  } catch (error) {
    console.error("Error fetching message:", error)
    return NextResponse.json(
      { error: "Failed to fetch message" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check for admin authorization
    const user = await getSession()
    
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = params.id
    const { read } = await req.json()

    if (read === undefined) {
      return NextResponse.json(
        { error: "Missing required field: read" },
        { status: 400 }
      )
    }

    // Update the message's read status
    await sql`UPDATE contact_messages SET read = ${read} WHERE id = ${id}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating message:", error)
    return NextResponse.json(
      { error: "Failed to update message" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check for admin authorization
    const user = await getSession()
    
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = params.id

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
