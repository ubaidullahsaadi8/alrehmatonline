import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string, studentId: string } }
) {
  try {
    // Verify admin user
    const user = await getSession()
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Delete the enrollment record
    await sql`
      DELETE FROM student_courses
      WHERE course_id = ${params.id}
      AND student_id = ${params.studentId}
    `

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("[COURSE_STUDENT_DELETE]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}