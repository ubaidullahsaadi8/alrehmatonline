import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"

export async function GET(request: NextRequest) {
  try {
    // Get current logged-in user
    const user = await getSession()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log(`Fetching courses for student: ${user.id}`)
    
    // Fetch student's enrolled courses with full course details
    const enrolledCourses = await sql`
      SELECT 
        c.id as course_id,
        c.title,
        c.description,
        c.image,
        c.level,
        c.category,
        c.duration,
        c.price,
        c.featured,
        c.meeting_link,
        c.meeting_time,
        c.meeting_date,
        sc.id as enrollment_id,
        sc.status as enrollment_status,
        sc.total_fee as enrollment_fee,
        sc.enrollment_date as enrolled_at,
        sc.created_at,
        sc.fee_type,
        sc.monthly_amount,
        sc.installments_count
      FROM student_courses sc
      JOIN courses c ON sc.course_id = c.id
      WHERE sc.student_id = ${user.id}
      AND sc.status IN ('active', 'enrolled')
      ORDER BY sc.created_at DESC
    `

    console.log(`Found ${enrolledCourses.length} courses for student ${user.id}`)

    // For each course, get ALL instructors
    const coursesWithDetails = await Promise.all(
      enrolledCourses.map(async (course) => {
        const instructors = await sql`
          SELECT 
            u.id,
            u.name,
            u.email,
            u.avatar
          FROM course_instructors ci
          JOIN users u ON ci.instructor_id = u.id
          WHERE ci.course_id = ${course.course_id}
          AND ci.status = 'active'
          ORDER BY u.name
        `

        return {
          id: course.course_id,
          title: course.title,
          description: course.description,
          image: course.image,
          level: course.level,
          category: course.category,
          duration: course.duration,
          price: parseFloat(course.price) || 0,
          featured: course.featured,
          meeting: {
            link: course.meeting_link,
            time: course.meeting_time,
            date: course.meeting_date
          },
          instructors: instructors.map(inst => ({
            id: inst.id,
            name: inst.name,
            email: inst.email,
            avatar: inst.avatar
          })),
          enrollment: {
            id: course.enrollment_id,
            status: course.enrollment_status,
            fee: parseFloat(course.enrollment_fee) || 0,
            discount: 0,
            enrolled_at: course.enrolled_at,
            progress: 0,
            fee_type: course.fee_type,
            monthly_amount: parseFloat(course.monthly_amount) || 0,
            installments_count: course.installments_count
          }
        }
      })
    )

    return NextResponse.json({ 
      courses: coursesWithDetails,
      total: coursesWithDetails.length 
    })

  } catch (error) {
    console.error("Error fetching student courses:", error)
    return NextResponse.json(
      { error: "Failed to fetch courses" }, 
      { status: 500 }
    )
  }
}