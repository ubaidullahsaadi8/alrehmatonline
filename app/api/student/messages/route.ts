import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"

export async function GET(request: NextRequest) {
  try {
    const user = await getSession()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get all messages where student is sender or recipient
    const messages = await sql`
      SELECT 
        m.id,
        m.subject,
        m.content,
        m.sender_id,
        m.recipient_id,
        m.read,
        m.created_at,
        m.course_id,
        sender.name as sender_name,
        sender.avatar as sender_avatar,
        recipient.name as recipient_name,
        c.title as course_title
      FROM messages m
      JOIN users sender ON m.sender_id = sender.id
      JOIN users recipient ON m.recipient_id = recipient.id
      LEFT JOIN courses c ON m.course_id = c.id
      WHERE m.sender_id = ${user.id} OR m.recipient_id = ${user.id}
      ORDER BY m.created_at DESC
    `

    return NextResponse.json({ messages })

  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json(
      { error: "Failed to fetch messages" }, 
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSession()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { subject, content, recipient_id, course_id } = await request.json()

    if (!subject || !content || !recipient_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Verify recipient is an instructor the student is enrolled with
    const isValidInstructor = await sql`
      SELECT 1 FROM student_enrollments se
      WHERE se.student_id = ${user.id}
      AND se.instructor_id = ${recipient_id}
      AND se.status = 'active'
    `

    if (!(isValidInstructor as any[]).length) {
      return NextResponse.json({ error: "Can only message your instructors" }, { status: 403 })
    }

    // Insert message
    await sql`
      INSERT INTO messages (id, subject, content, sender_id, recipient_id, course_id, read, created_at)
      VALUES (
        ${crypto.randomUUID()},
        ${subject},
        ${content},
        ${user.id},
        ${recipient_id},
        ${course_id || null},
        false,
        NOW()
      )
    `

    return NextResponse.json({ 
      success: true,
      message: "Message sent successfully" 
    })

  } catch (error) {
    console.error("Error sending message:", error)
    return NextResponse.json(
      { error: "Failed to send message" }, 
      { status: 500 }
    )
  }
}