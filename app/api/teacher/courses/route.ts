import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"

export async function GET(request: NextRequest) {
  try {
    console.log("Teacher courses API - Starting request")
    
    const user = await getSession()
    console.log("Teacher courses API - Session user:", {
      id: user?.id,
      email: user?.email,
      role: user?.role,
      userType: user?.user_type
    })
    
    if (!user) {
      console.log("Teacher courses API - No user session found")
      return NextResponse.json({ error: "Unauthorized - No session" }, { status: 401 })
    }
    
    if (user.role !== "instructor" && user.user_type !== "instructor") {
      console.log("Teacher courses API - Not an instructor:", { role: user.role, userType: user.user_type })
      return NextResponse.json({ error: "Unauthorized - Not an instructor" }, { status: 401 })
    }

    const instructorId = user.id
    console.log("Teacher courses API - Fetching courses for instructor:", instructorId)

    // Fetch courses assigned to this instructor
    const courseInstructors = await sql`
      WITH active_students AS (
        SELECT 
          course_id,
          COUNT(*)::int as student_count
        FROM student_courses
        WHERE status = 'active'
        GROUP BY course_id
      )
      SELECT 
        c.id,
        c.title,
        c.description,
        c.image,
        c.level,
        c.duration,
        c.category,
        c.price,
        ci.assigned_at,
        ci.role as instructor_role,
        ci.status as assignment_status,
        COALESCE(ast.student_count, 0) as student_count,
        (
          SELECT json_agg(json_build_object(
            'id', u.id,
            'name', u.name,
            'role', ci2.role,
            'status', ci2.status
          ))
          FROM course_instructors ci2
          JOIN users u ON ci2.instructor_id = u.id
          WHERE ci2.course_id = c.id
          AND ci2.status = 'active'
        ) as other_instructors
      FROM courses c
      JOIN course_instructors ci ON c.id = ci.course_id
      LEFT JOIN active_students ast ON c.id = ast.course_id
      WHERE ci.instructor_id = ${instructorId}
      AND ci.status = 'active'
      ORDER BY ci.assigned_at DESC
    `

    // Fetch students for each course
    const coursesWithStudents = await Promise.all(
      courseInstructors.map(async (course: any) => {
        const students = await sql`
          SELECT 
            u.id,
            u.name,
            u.email,
            u.avatar,
            sc.enrollment_date as enrolled_at,
            sc.status,
            sc.total_fee,
            sc.paid_amount,
            sc.fee_type,
            sc.currency,
            CASE 
              WHEN sc.completion_date IS NOT NULL THEN 100
              ELSE EXTRACT(EPOCH FROM (NOW() - sc.enrollment_date))::float / 
                   EXTRACT(EPOCH FROM (sc.completion_date - sc.enrollment_date))::float * 100
            END as progress
          FROM student_courses sc
          JOIN users u ON sc.student_id = u.id
          WHERE sc.course_id = ${course.id}
          AND sc.status = 'active'
          ORDER BY sc.enrollment_date DESC
        `

        // Get meeting information from any active student enrollment
        // (All active students in a course have the same meeting info)
        const meetingInfo = await sql`
          SELECT 
            meeting_link,
            meeting_date,
            meeting_time
          FROM student_courses
          WHERE course_id = ${course.id}
          AND status = 'active'
          AND (meeting_link IS NOT NULL OR meeting_date IS NOT NULL OR meeting_time IS NOT NULL)
          LIMIT 1
        `

        return {
          ...course,
          meeting_link: meetingInfo[0]?.meeting_link || null,
          meeting_date: meetingInfo[0]?.meeting_date || null,
          meeting_time: meetingInfo[0]?.meeting_time || null,
          students,
          student_details: {
            total: students.length,
            active: students.filter((s: any) => s.status === 'active').length,
            completed: students.filter((s: any) => s.status === 'completed').length,
          }
        }
      })
    )

    console.log("Teacher courses API - Found courses:", coursesWithStudents.length)
    
    return NextResponse.json({ 
      courses: coursesWithStudents,
      total: coursesWithStudents.length 
    })

  } catch (error) {
    console.error("Error in teacher courses API:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    })
    
    // Check if it's a database error
    if (error instanceof Error && error.message.includes('relation "course_instructors" does not exist')) {
      return NextResponse.json(
        { error: "Database setup required. Please run migrations." }, 
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { 
        error: "Failed to fetch courses",
        details: error instanceof Error ? error.message : "Unknown error"
      }, 
      { status: 500 }
    )
  }
}