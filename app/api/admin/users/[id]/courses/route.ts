import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"


export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    
    const user = await getSession()
    
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = params.id

    
    const userCourses = await sql`
      SELECT 
        uc.id,
        c.title,
        uc.status,
        uc.enrollment_date,
        uc.completion_date,
        uc.total_fee,
        uc.paid_amount,
        uc.due_date,
        json_build_object(
          'image', c.image,
          'description', c.description,
          'duration', c.duration,
          'level', c.level,
          'instructor', c.instructor,
          'category', c.category
        ) as course_details
      FROM student_courses sc
      JOIN courses c ON sc.course_id = c.id
      WHERE sc.student_id = ${userId}
      ORDER BY uc.enrollment_date DESC
    `

    return NextResponse.json(userCourses)
  } catch (error) {
    console.error("Error fetching user courses:", error)
    return NextResponse.json(
      { error: "Failed to fetch user courses" },
      { status: 500 }
    )
  }
}

// Assign a course to a user
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check for admin authorization
    const adminUser = await getSession()
    
    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = params.id
    
    // Get data from request
    const { courseId, status, totalFee, paidAmount, dueDate } = await req.json()

    // Validate required fields
    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      )
    }

    // Check if user exists
    const userCheck = await sql`
      SELECT id FROM users WHERE id = ${userId}
    `

    if (userCheck.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Check if course exists
    const courseCheck = await sql`
      SELECT id FROM courses WHERE id = ${courseId}
    `

    if (courseCheck.length === 0) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      )
    }

    // Check if user is already enrolled in this course
    const existingEnrollment = await sql`
      SELECT id FROM student_courses 
      WHERE student_id = ${userId} AND course_id = ${courseId}
    `

    if (existingEnrollment.length > 0) {
      return NextResponse.json(
        { error: "User is already enrolled in this course" },
        { status: 400 }
      )
    }

    // Create enrollment (no default fee - teacher will set manually)
    const enrollmentId = `enrollment-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    const enrollment = await sql`
      INSERT INTO student_courses (
        id,
        student_id,
        course_id,
        status,
        total_fee,
        paid_amount,
        due_date
      ) VALUES (
        ${enrollmentId},
        ${userId},
        ${courseId},
        ${status || 'pending'},
        ${totalFee || null},
        ${paidAmount || null},
        ${dueDate || null}
      )
      RETURNING id
    `

    // If there's an initial payment, record it
    if (paidAmount && parseFloat(paidAmount) > 0) {
      const paymentId = `payment-${Date.now()}-${Math.floor(Math.random() * 1000)}`
      await sql`
        INSERT INTO course_payments (
          id,
          user_course_id,
          amount,
          payment_method,
          reference,
          notes,
          created_by
        ) VALUES (
          ${paymentId},
          ${enrollmentId},
          ${paidAmount},
          ${'cash'},
          ${'Initial payment'},
          ${'Initial payment at enrollment'},
          ${adminUser.id}
        )
      `
    }

    // Also create a notification for the user about the course assignment
    const notificationId = `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    
    // Get course title for the notification
    const courseData = await sql`
      SELECT title FROM courses WHERE id = ${courseId}
    `
    
    const courseTitle = courseData[0]?.title || "a new course"
    
    await sql`
      INSERT INTO notifications (
        id,
        user_id,
        title,
        message,
        type,
        created_by
      ) VALUES (
        ${notificationId},
        ${userId},
        ${'New Course Enrollment'},
        ${`You have been enrolled in ${courseTitle}. Check your courses section for details.`},
        ${'info'},
        ${adminUser.id}
      )
    `

    return NextResponse.json({ 
      success: true,
      id: enrollmentId,
      message: "Course assigned successfully"
    })
  } catch (error) {
    console.error("Error assigning course to user:", error)
    return NextResponse.json(
      { error: "Failed to assign course to user" },
      { status: 500 }
    )
  }
}
