import { NextRequest, NextResponse } from "next/server"
import { sql } from '@/lib/db'
import { getSession } from "@/lib/session"



export async function GET(request: NextRequest) {
  try {
    const user = await getSession()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check student_courses table with meeting info
    const studentCourses = await sql`
      SELECT 
        id,
        student_id,
        course_id,
        status,
        meeting_link,
        meeting_date,
        meeting_time,
        created_at,
        updated_at
      FROM student_courses 
      WHERE student_id = ${user.id}
      LIMIT 10
    `

    // Check the join with course details
    const joinedData = await sql`
      SELECT 
        sc.id as enrollment_id,
        sc.student_id,
        sc.course_id,
        sc.status as enrollment_status,
        sc.meeting_link,
        sc.meeting_date,
        sc.meeting_time,
        c.title as course_title,
        c.category,
        c.instructor_id,
        u.name as instructor_name
      FROM student_courses sc
      LEFT JOIN courses c ON sc.course_id = c.id
      LEFT JOIN users u ON c.instructor_id = u.id
      WHERE sc.student_id = ${user.id}
    `

    // Count meetings (only active enrollments)
    const meetingCount = await sql`
      SELECT COUNT(*) as total_meetings
      FROM student_courses
      WHERE student_id = ${user.id}
      AND status = 'active'
      AND (meeting_link IS NOT NULL OR meeting_date IS NOT NULL OR meeting_time IS NOT NULL)
    `

    return NextResponse.json({ 
      user_id: user.id,
      user_name: user.name,
      total_enrollments: studentCourses.length,
      total_meetings: meetingCount[0]?.total_meetings || 0,
      student_courses: studentCourses,
      meetings_with_details: joinedData
    })

  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch debug data", details: String(error) }, 
      { status: 500 }
    )
  }
}
