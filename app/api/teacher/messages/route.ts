import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"

export async function POST(request: NextRequest) {
  try {
    const user = await getSession()
    
    if (!user || user.user_type !== 'instructor') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const instructorId = user.id

    const { title, message, type, messageType, courseId, studentId } = await request.json()

    if (!title || !message) {
      return NextResponse.json({ error: "Title and message are required" }, { status: 400 })
    }

    let recipients: string[] = []

    if (messageType === "all") {
      
      const allStudents = await sql`
        SELECT DISTINCT u.id 
        FROM users u
        JOIN student_enrollments se ON u.id = se.student_id
        WHERE se.instructor_id = ${instructorId}
        AND se.status = 'active'
        AND u.user_type = 'student'
      `
      recipients = (allStudents as any[]).map(s => s.id)
    } else if (messageType === "course" && courseId) {
      
      const courseStudents = await sql`
        SELECT u.id 
        FROM users u
        JOIN student_enrollments se ON u.id = se.student_id
        WHERE se.instructor_id = ${instructorId}
        AND se.course_id = ${courseId}
        AND se.status = 'active'
        AND u.user_type = 'student'
      `
      recipients = (courseStudents as any[]).map(s => s.id)
    } else if (messageType === "individual" && studentId) {
      
      const isValidStudent = await sql`
        SELECT 1 FROM student_enrollments se
        WHERE se.instructor_id = ${instructorId}
        AND se.student_id = ${studentId}
        AND se.status = 'active'
      `
      
      if ((isValidStudent as any[]).length === 0) {
        return NextResponse.json({ error: "You can only message your enrolled students" }, { status: 403 })
      }
      
      recipients = [studentId]
    } else {
      return NextResponse.json({ error: "Invalid message configuration" }, { status: 400 })
    }

    if (recipients.length === 0) {
      return NextResponse.json({ error: "No recipients found" }, { status: 400 })
    }

    
    const instructorMessage = await sql`
      INSERT INTO instructor_messages (
        instructor_id, 
        student_id, 
        course_id, 
        title, 
        message, 
        type
      ) VALUES (
        ${instructorId},
        ${messageType === "individual" ? studentId : null},
        ${messageType === "course" ? courseId : null},
        ${title},
        ${message},
        ${type}
      )
      RETURNING id
    `

    
    const notificationPromises = recipients.map(recipientId =>
      sql`
        INSERT INTO notifications (
          user_id,
          title,
          message,
          type,
          sender_id,
          sender_type,
          created_by
        ) VALUES (
          ${recipientId},
          ${title},
          ${message},
          ${type},
          ${instructorId},
          'instructor',
          ${instructorId}
        )
      `
    )

    await Promise.all(notificationPromises)

    return NextResponse.json({ 
      success: true,
      message: `Message sent to ${recipients.length} student${recipients.length !== 1 ? 's' : ''}`,
      recipients: recipients.length
    })

  } catch (error) {
    console.error("Error sending message:", error)
    return NextResponse.json(
      { error: "Failed to send message" }, 
      { status: 500 }
    )
  }
}