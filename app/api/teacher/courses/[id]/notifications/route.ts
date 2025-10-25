import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getSession } from '@/lib/session'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getSession()
    
    if (!user || !user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const courseId = params.id
    const { message } = await request.json()

    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Verify instructor teaches this course
    const instructorCourse = await sql`
      SELECT id FROM course_instructors
      WHERE course_id = ${courseId} AND instructor_id = ${user.id} AND status = 'active'
    `

    if (instructorCourse.length === 0) {
      return NextResponse.json({ error: 'Not authorized for this course' }, { status: 403 })
    }

    // Insert notification
    const notification = await sql`
      INSERT INTO course_notifications (course_id, instructor_id, message)
      VALUES (${courseId}, ${user.id}, ${message.trim()})
      RETURNING id, message, created_at
    `

    return NextResponse.json({ 
      success: true,
      notification: notification[0]
    })

  } catch (error) {
    console.error('Error creating notification:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
