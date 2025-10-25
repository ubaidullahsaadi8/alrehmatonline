import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const courseId = params.id
    const { link, time, date, url } = await request.json()

    // Support both 'link' and 'url' parameters for backward compatibility
    const meetingLink = link || url

    // Debug logging
    console.log('Meeting Update Request:', {
      courseId,
      link,
      time,
      date,
      url,
      meetingLink
    })

    // Update meeting information for all ACTIVE enrolled students in this course
    const updatedEnrollments = await sql`
      UPDATE student_courses 
      SET 
        meeting_link = ${meetingLink || null},
        meeting_time = ${time || null},
        meeting_date = ${date || null},
        updated_at = CURRENT_TIMESTAMP
      WHERE course_id = ${courseId}
      AND status = 'active'
      RETURNING *
    `

    console.log(`Updated ${updatedEnrollments.length} active student enrollments with meeting info`)

    if (updatedEnrollments.length === 0) {
      return NextResponse.json({ 
        error: 'No active enrollments found for this course',
        message: 'Meeting information saved but no active students are enrolled yet'
      }, { status: 404 })
    }

    // Get course details for response
    const course = await sql`
      SELECT * FROM courses WHERE id = ${courseId}
    `

    return NextResponse.json({ 
      message: 'Meeting information updated successfully',
      updated_students: updatedEnrollments.length,
      course: course[0]
    })

  } catch (error) {
    console.error('Error updating meeting information:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}