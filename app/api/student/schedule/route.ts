import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"

export async function GET(request: NextRequest) {
  try {
    const user = await getSession()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get all schedule events for the student
    const events = []

    // Get meetings from courses
    const meetings = await sql`
      SELECT 
        c.id as course_id,
        c.title as course_title,
        c.category as course_category,
        c.meeting_link,
        c.meeting_date,
        c.meeting_time,
        u.name as instructor_name,
        'meeting' as type
      FROM student_enrollments se
      JOIN courses c ON se.course_id = c.id
      JOIN users u ON se.instructor_id = u.id
      WHERE se.student_id = ${user.id}
      AND se.status = 'active'
      AND c.meeting_date IS NOT NULL
    `

    for (const meeting of meetings as any[]) {
      events.push({
        id: `meeting-${meeting.course_id}`,
        title: `${meeting.course_title} - Class Meeting`,
        type: 'meeting',
        course_id: meeting.course_id,
        course_title: meeting.course_title,
        course_category: meeting.course_category,
        instructor_name: meeting.instructor_name,
        date: meeting.meeting_date.toISOString().split('T')[0],
        time: meeting.meeting_time,
        duration: 60, // Default 60 minutes
        meeting_link: meeting.meeting_link,
        description: `Online meeting for ${meeting.course_title}`,
        status: 'upcoming'
      })
    }

    // Get assignments (if we had an assignments table, we would fetch them here)
    // For now, we'll create some sample assignment deadlines based on courses
    const courses = await sql`
      SELECT 
        c.id,
        c.title,
        c.category,
        se.enrolled_at
      FROM student_enrollments se
      JOIN courses c ON se.course_id = c.id
      WHERE se.student_id = ${user.id}
      AND se.status = 'active'
    `

    for (const course of courses as any[]) {
      // Add sample assignment deadlines (every 2 weeks after enrollment)
      const enrollmentDate = new Date(course.enrolled_at)
      for (let i = 1; i <= 4; i++) {
        const assignmentDate = new Date(enrollmentDate)
        assignmentDate.setDate(assignmentDate.getDate() + (i * 14))
        
        // Only add future assignments
        if (assignmentDate > new Date()) {
          events.push({
            id: `assignment-${course.id}-${i}`,
            title: `Assignment ${i} - ${course.title}`,
            type: 'assignment',
            course_id: course.id,
            course_title: course.title,
            course_category: course.category,
            instructor_name: '',
            date: assignmentDate.toISOString().split('T')[0],
            time: '23:59',
            duration: 0,
            description: `Assignment deadline for ${course.title}`,
            status: 'upcoming'
          })
        }
      }
    }

    // Sort events by date
    events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    return NextResponse.json({ events })

  } catch (error) {
    console.error("Error fetching schedule:", error)
    return NextResponse.json(
      { error: "Failed to fetch schedule" }, 
      { status: 500 }
    )
  }
}