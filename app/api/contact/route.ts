import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, subject, message } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    
    const id = `clq${Date.now().toString(36)}${Math.random().toString(36).substr(2, 9)}`

    await sql`
      INSERT INTO contact_messages (id, name, email, phone, subject, message)
      VALUES (${id}, ${name}, ${email}, ${phone || null}, ${subject}, ${message})
    `

    return NextResponse.json({ success: true, message: "Message sent successfully" })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
