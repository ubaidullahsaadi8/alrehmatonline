import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"


export async function GET() {
  try {
    
    const user = await getSession()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    
    const notifications = await sql`
      SELECT * FROM notifications 
      WHERE user_id = ${user.id}
      ORDER BY created_at DESC
    `
    
    // Get count of unread notifications
    const unreadCount = await sql`
      SELECT COUNT(*) as count
      FROM notifications
      WHERE user_id = ${user.id} AND read = false
    `

    // Get total count of notifications
    const totalCount = await sql`
      SELECT COUNT(*) as count
      FROM notifications
      WHERE user_id = ${user.id}
    `

    // Get user info for context
    const userInfo = await sql`
      SELECT id, email, name, role FROM users
      WHERE id = ${user.id}
    `
    
    return NextResponse.json({
      user: userInfo[0] || null,
      notifications: notifications || [],
      counts: {
        unread: unreadCount[0]?.count || 0,
        total: totalCount[0]?.count || 0
      },
      debug: {
        userId: user.id,
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error("Debug error:", error)
    return NextResponse.json(
      { error: "Debug endpoint failed", details: String(error) },
      { status: 500 }
    )
  }
}
