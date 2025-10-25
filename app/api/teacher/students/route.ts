import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"

export async function GET(request: NextRequest) {
  try {
    const user = await getSession()
    
    if (!user || user.user_type !== 'instructor') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const studentsWithCourses = await sql`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.avatar,
        u.country,
        u.created_at as student_since,
        COUNT(se.id)::int as total_courses,
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'course_id', c.id,
            'course_title', c.title,
            'enrolled_at', se.enrolled_at,
            'progress', se.progress,
            'status', se.status
          ) ORDER BY se.enrolled_at DESC
        ) as enrolled_courses
      FROM users u
      JOIN student_enrollments se ON u.id = se.student_id
      JOIN courses c ON se.course_id = c.id
      WHERE se.instructor_id = ${user.id}
      AND se.status = 'active'
      AND u.user_type = 'student'
      GROUP BY u.id, u.name, u.email, u.avatar, u.country, u.created_at
      ORDER BY u.name ASC
    `

    const formattedStudents = (studentsWithCourses as any[]).map(student => ({
      ...student,
      enrolled_courses: student.enrolled_courses || []
    }))

    return NextResponse.json({ 
      students: formattedStudents,
      total: formattedStudents.length 
    })

  } catch (error) {
    console.error("Error fetching teacher students:", error)
    return NextResponse.json(
      { error: "Failed to fetch students" }, 
      { status: 500 }
    )
  }
}