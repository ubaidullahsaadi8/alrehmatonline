import { NextRequest, NextResponse } from "next/server"
import { sql } from '@/lib/db'
import { getSession } from '@/lib/session'

export async function GET(request: NextRequest) {
  try {
    const user = await getSession()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get all courses the student is enrolled in with ALL their instructors
    const enrolledCourses = await sql`
      SELECT 
        c.id as course_id,
        c.title as course_title,
        ci.instructor_id,
        u.name as instructor_name,
        u.email as instructor_email,
        u.avatar as instructor_avatar,
        u.bio as instructor_bio
      FROM student_courses sc
      JOIN courses c ON sc.course_id = c.id
      JOIN course_instructors ci ON c.id = ci.course_id AND ci.status = 'active'
      JOIN users u ON ci.instructor_id = u.id
      WHERE sc.student_id = ${user.id}
      AND sc.status = 'active'
      ORDER BY u.name, c.title
    `

    // Group courses by instructor
    const instructorsMap = new Map()

    for (const course of enrolledCourses) {
      const instructorId = course.instructor_id
      
      if (!instructorsMap.has(instructorId)) {
        instructorsMap.set(instructorId, {
          id: instructorId,
          name: course.instructor_name,
          email: course.instructor_email,
          avatar: course.instructor_avatar,
          bio: course.instructor_bio,
          courses: []
        })
      }

      instructorsMap.get(instructorId).courses.push({
        id: course.course_id,
        title: course.course_title
      })
    }

    const instructors = Array.from(instructorsMap.values())

    return NextResponse.json({ instructors })

  } catch (error) {
    console.error("Error fetching instructors:", error)
    return NextResponse.json(
      { error: "Failed to fetch instructors" }, 
      { status: 500 }
    )
  }
}