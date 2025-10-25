import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"

// GET enrolled students
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin user
    const user = await getSession()
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const enrollments = await sql`
      SELECT 
        sc.enrollment_date,
        sc.status,
        u.id,
        u.name,
        u.email
      FROM student_courses sc
      INNER JOIN users u ON sc.student_id = u.id
      WHERE sc.course_id = ${params.id}
      AND sc.status = 'active'
      ORDER BY sc.enrollment_date DESC
    `

    // Transform the data to match our frontend expectations
    const formattedStudents = enrollments.map((enrollment: any) => ({
      id: enrollment.id,
      name: enrollment.name,
      email: enrollment.email,
      enrollmentDate: enrollment.enrollment_date,
      status: enrollment.status
    }))

    return NextResponse.json(formattedStudents)
  } catch (error) {
    console.error("[COURSE_STUDENTS_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}