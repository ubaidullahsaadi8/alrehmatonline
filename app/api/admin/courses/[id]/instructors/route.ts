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

    const courseId = params.id
    
    // Get all instructors assigned to this course
    const instructors = await sql`
      SELECT 
        u.id,
        u.name,
        ci.role,
        ci.status
      FROM users u
      JOIN course_instructors ci ON u.id = ci.instructor_id
      WHERE ci.course_id = ${courseId}
      AND ci.status = 'active'
      ORDER BY u.name
    `

    return NextResponse.json(instructors)
  } catch (error) {
    console.error("Error fetching course instructors:", error)
    return NextResponse.json(
      { error: "Failed to fetch course instructors" },
      { status: 500 }
    )
  }
}