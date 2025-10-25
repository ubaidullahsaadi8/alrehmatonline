import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getSession } from '@/lib/session'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getSession()
    
    if (!user || !user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const courseId = params.id

    // Get course details with enrollment status
    const result = await sql`
      SELECT 
        c.id, 
        c.title, 
        c.description, 
        c.level, 
        c.category, 
        c.duration, 
        c.meeting_link, 
        c.meeting_time, 
        c.meeting_date,
        sc.id as enrollment_id, 
        sc.status as enrollment_status, 
        sc.enrollment_date as enrolled_at
      FROM student_courses sc
      JOIN courses c ON sc.course_id = c.id
      WHERE sc.student_id = ${user.id} AND c.id = ${courseId}
    `

    if (!result || result.length === 0) {
      return NextResponse.json({ error: 'Course not found or not enrolled' }, { status: 404 })
    }

    const courseData = result[0]

    // Get ALL instructors for this course
    const instructors = await sql`
      SELECT 
        u.id, 
        u.name, 
        u.email, 
        u.avatar
      FROM course_instructors ci
      JOIN users u ON ci.instructor_id = u.id
      WHERE ci.course_id = ${courseId} AND ci.status = 'active'
      ORDER BY u.name
    `

    const course = {
      id: courseData.id,
      title: courseData.title,
      description: courseData.description,
      level: courseData.level,
      category: courseData.category,
      duration: courseData.duration,
      meeting_link: courseData.meeting_link || '',
      meeting_time: courseData.meeting_time || '',
      meeting_date: courseData.meeting_date || '',
      instructors: instructors.map(inst => ({
        id: inst.id,
        name: inst.name,
        email: inst.email,
        avatar: inst.avatar
      })),
      enrollment: {
        id: courseData.enrollment_id,
        status: courseData.enrollment_status || 'active',
        enrolled_at: courseData.enrolled_at
      }
    }

    return NextResponse.json({ course })

  } catch (error) {
    console.error('Error fetching course detail:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}