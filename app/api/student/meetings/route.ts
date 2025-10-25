import { NextRequest, NextResponse } from "next/server"
import { sql } from '@/lib/db'
import { getSession } from "@/lib/session"



export async function GET(request: NextRequest) {
  try {
    // Get current logged-in user
    const user = await getSession()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log(`Fetching meetings for student: ${user.id}`)

    // Get all meetings from student_courses table (only ACTIVE enrollments)
    const meetings = await sql`
      SELECT 
        sc.id as enrollment_id,
        sc.course_id,
        sc.meeting_link,
        sc.meeting_date,
        sc.meeting_time,
        c.title as course_title,
        c.category as course_category,
        c.instructor_id,
        u.name as instructor_name,
        u.avatar as instructor_avatar
      FROM student_courses sc
      JOIN courses c ON sc.course_id = c.id
      LEFT JOIN users u ON c.instructor_id = u.id
      WHERE sc.student_id = ${user.id}
      AND sc.status = 'active'
      ORDER BY 
        CASE 
          WHEN sc.meeting_date IS NULL THEN 1
          ELSE 0
        END,
        sc.meeting_date ASC,
        sc.meeting_time ASC
    `

    console.log(`Found ${meetings.length} meetings:`, meetings)

    const meetingsData = meetings.map(meeting => ({
      id: meeting.enrollment_id,
      course_id: meeting.course_id,
      course_title: meeting.course_title,
      course_category: meeting.course_category,
      instructor_id: meeting.instructor_id,
      instructor_name: meeting.instructor_name,
      instructor_avatar: meeting.instructor_avatar,
      meeting_link: meeting.meeting_link,
      meeting_date: meeting.meeting_date,
      meeting_time: meeting.meeting_time
    }))

    return NextResponse.json({ meetings: meetingsData })

  } catch (error) {
    console.error("Error fetching meetings:", error)
    return NextResponse.json(
      { error: "Failed to fetch meetings" }, 
      { status: 500 }
    )
  }
}