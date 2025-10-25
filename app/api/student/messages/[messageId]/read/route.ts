import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"

export async function PUT(
  request: NextRequest,
  { params }: { params: { messageId: string } }
) {
  try {
    const user = await getSession()
    const { messageId } = params
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Update message as read only if student is the recipient
    await sql`
      UPDATE messages 
      SET read = true
      WHERE id = ${messageId} 
      AND recipient_id = ${user.id}
    `

    return NextResponse.json({ 
      success: true,
      message: "Message marked as read" 
    })

  } catch (error) {
    console.error("Error marking message as read:", error)
    return NextResponse.json(
      { error: "Failed to mark message as read" }, 
      { status: 500 }
    )
  }
}