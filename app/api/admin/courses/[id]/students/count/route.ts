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
    
    // Get count of active students in this course
    const result = await sql`
      SELECT COUNT(*)::int as count
      FROM student_courses
      WHERE course_id = ${courseId}
      AND status = 'active'
    `

    return NextResponse.json({ count: result[0]?.count || 0 })
  } catch (error) {
    console.error("Error fetching student count:", error)
    return NextResponse.json(
      { error: "Failed to fetch student count" },
      { status: 500 }
    )
  }
}