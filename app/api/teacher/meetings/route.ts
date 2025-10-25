import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"

export async function GET(request: NextRequest) {
  try {
    const user = await getSession()
    
    if (!user || user.user_type !== 'instructor') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get all meetings for courses taught by this instructor
    const meetings = await sql`
      SELECT 
        c.id as course_id,
        c.title as course_title,
        c.category as course_category,
        c.meeting_link,
        c.meeting_date,
        c.meeting_time,
        c.duration,
        c.description,
        c.created_at,
        COUNT(se.student_id) as student_count
      FROM course_instructors ci
      JOIN courses c ON ci.course_id = c.id
      LEFT JOIN student_enrollments se ON c.id = se.course_id AND se.status = 'active'
      WHERE ci.instructor_id = ${user.id}
      AND ci.status = 'active'
      GROUP BY c.id, c.title, c.category, c.meeting_link, c.meeting_date, c.meeting_time, c.duration, c.description, c.created_at
      ORDER BY 
        CASE 
          WHEN c.meeting_date IS NULL THEN 1
          ELSE 0
        END,
        c.meeting_date ASC,
        c.meeting_time ASC
    `

    const meetingsData = (meetings as any[]).map(meeting => ({
      id: `meeting-${meeting.course_id}`,
      course_id: meeting.course_id,
      course_title: meeting.course_title,
      course_category: meeting.course_category,
      meeting_link: meeting.meeting_link,
      meeting_date: meeting.meeting_date,
      meeting_time: meeting.meeting_time,
      duration: meeting.duration,
      description: meeting.description,
      student_count: Number(meeting.student_count),
      created_at: meeting.created_at,
      status: 'upcoming' // Will be calculated on frontend
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