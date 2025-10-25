import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getSession()
    
    if (!user || user.user_type !== "instructor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const courseId = params.id
    const body = await request.json()
    const { student_ids, subject, content } = body

    if (!student_ids || !Array.isArray(student_ids) || student_ids.length === 0) {
      return NextResponse.json({ error: "No students selected" }, { status: 400 })
    }

    if (!subject || !content) {
      return NextResponse.json({ error: "Subject and content are required" }, { status: 400 })
    }

    const instructorId = user.id

    // Verify instructor has access to this course
    const courseAccess = await sql`
      SELECT id FROM course_instructors
      WHERE course_id = ${courseId}
      AND instructor_id = ${instructorId}
      AND status = 'active'
      LIMIT 1
    `

    if (courseAccess.length === 0) {
      return NextResponse.json({ error: "Unauthorized access to course" }, { status: 403 })
    }

    // Create notifications for each student
    const notificationPromises = student_ids.map(async (studentId: string) => {
      // Verify student is enrolled in the course
      const enrollment = await sql`
        SELECT id FROM user_courses
        WHERE user_id = ${studentId}
        AND course_id = ${courseId}
        LIMIT 1
      `

      if (enrollment.length > 0) {
        // Create notification
        const notificationId = crypto.randomUUID()
        await sql`
          INSERT INTO notifications (
            id, user_id, type, title, message, link, read, created_at
          )
          VALUES (
            ${notificationId}, 
            ${studentId}, 
            'message', 
            ${subject}, 
            ${content}, 
            ${`/courses/${courseId}`},
            false, 
            NOW()
          )
        `

        // TODO: Send email notification
        // You can add email sending logic here using a service like SendGrid, AWS SES, etc.
        
        return { studentId, success: true }
      } else {
        return { studentId, success: false, reason: 'Not enrolled' }
      }
    })

    const results = await Promise.all(notificationPromises)
    const successCount = results.filter(r => r.success).length

    console.log(`Sent message to ${successCount}/${student_ids.length} students`)

    return NextResponse.json({ 
      message: `Message sent to ${successCount} student(s)`,
      results,
      success: true
    })

  } catch (error) {
    console.error("Error sending messages:", error)
    return NextResponse.json(
      { error: "Failed to send messages" }, 
      { status: 500 }
    )
  }
}
