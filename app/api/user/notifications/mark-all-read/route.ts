import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"


export async function PUT(req: NextRequest) {
  try {
    
    const user = await getSession()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    
    await sql`
      UPDATE notifications
      SET read = true
      WHERE user_id = ${user.id} AND read = false
    `

    return NextResponse.json({ 
      success: true,
      message: "All notifications marked as read"
    })
  } catch (error) {
    console.error("Error marking all notifications as read:", error)
    return NextResponse.json(
      { error: "Failed to mark notifications as read" },
      { status: 500 }
    )
  }
}
