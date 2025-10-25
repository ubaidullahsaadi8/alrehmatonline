import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, courseId, message } = await req.json()

    
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      )
    }

    const id = crypto.randomUUID()

    
    await sql`
      CREATE TABLE IF NOT EXISTS course_requests (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        message TEXT NOT NULL,
        course_id TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    
    // Insert course request into database
    await sql`
      INSERT INTO course_requests (
        id, name, email, phone, course_id, message, created_at
      ) VALUES (
        ${id}, ${name}, ${email}, ${phone || null}, ${courseId || null}, ${message}, NOW()
      )
    `

    console.log(`Course request created: ${id}`)
    
    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error("Error creating course request:", error)
    return NextResponse.json(
      { error: "Failed to create course request" },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    // Check if table exists, if not create it
    await sql`
      CREATE TABLE IF NOT EXISTS course_requests (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        message TEXT NOT NULL,
        course_id TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    
    // Get query parameters
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    // If id is provided, get specific course request
    if (id) {
      const courseRequest = await sql`
        SELECT 
          id, 
          name, 
          email, 
          phone, 
          course_id as "courseId", 
          message, 
          status,
          created_at as "createdAt"
        FROM course_requests 
        WHERE id = ${id}
      `

      if (courseRequest.length === 0) {
        return NextResponse.json(
          { error: "Course request not found" },
          { status: 404 }
        )
      }

      return NextResponse.json(courseRequest[0])
    }

    // Otherwise, get all course requests (sorted by creation date, newest first)
    const courseRequests = await sql`
      SELECT 
        id, 
        name, 
        email, 
        phone, 
        course_id as "courseId", 
        message, 
        status,
        created_at as "createdAt"
      FROM course_requests 
      ORDER BY created_at DESC
    `

    return NextResponse.json(courseRequests)
  } catch (error) {
    console.error("Error fetching course requests:", error)
    return NextResponse.json(
      { error: "Failed to fetch course requests" },
      { status: 500 }
    )
  }
}
