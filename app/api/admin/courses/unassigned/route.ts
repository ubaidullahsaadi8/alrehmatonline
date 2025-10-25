import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"

export async function GET(req: NextRequest) {
  try {
    console.log("Fetching unassigned courses")
    
    
    const user = await getSession()
    if (!user || user.role !== "admin") {
      console.log("Unauthorized attempt to access unassigned courses")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    
    const unassignedCourses = await sql`
      SELECT 
        c.id,
        c.title,
        c.description,
        c.image,
        c.level,
        c.duration,
        c.category,
        c.price,
        COALESCE(ci.instructor_count, 0) as instructor_count
      FROM courses c
      LEFT JOIN (
        SELECT course_id, COUNT(*) as instructor_count
        FROM course_instructors 
        WHERE status = 'active'
        GROUP BY course_id
      ) ci ON c.id = ci.course_id
      WHERE ci.instructor_count IS NULL
         OR ci.instructor_count = 0
      ORDER BY c.created_at DESC
    `
    
    console.log(`Found ${unassignedCourses ? unassignedCourses.length : 0} unassigned courses`)
    return NextResponse.json(unassignedCourses || [])
  } catch (error) {
    console.error("Error fetching unassigned courses:", error)
    return NextResponse.json(
      { error: "Failed to fetch unassigned courses" }, 
      { status: 500 }
    )
  }
}
