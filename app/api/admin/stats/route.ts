import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"

export async function GET(req: NextRequest) {
  try {
    
    const user = await getSession()
    
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    
    const [
      usersCount,
      messagesCount,
      coursesCount,
      servicesCount,
      testimonialsCount
    ] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM users`,
      sql`SELECT COUNT(*) as count FROM contact_messages`,
      sql`SELECT COUNT(*) as count FROM courses`,
      sql`SELECT COUNT(*) as count FROM services`,
      sql`SELECT COUNT(*) as count FROM testimonials`
    ]);

    return NextResponse.json({
      users: usersCount[0]?.count || 0,
      contactMessages: messagesCount[0]?.count || 0,
      courses: coursesCount[0]?.count || 0,
      services: servicesCount[0]?.count || 0,
      testimonials: testimonialsCount[0]?.count || 0
    })
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    )
  }
}
