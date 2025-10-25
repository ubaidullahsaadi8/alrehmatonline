import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, courseId, date, time, message } = await req.json()

    
    if (!name || !email || !date || !time || !courseId) {
      return NextResponse.json(
        { error: "Name, email, course, date, and time are required" },
        { status: 400 }
      )
    }

    const id = crypto.randomUUID()

    
    await sql`
      CREATE TABLE IF NOT EXISTS course_bookings (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        date DATE NOT NULL,
        time TEXT NOT NULL,
        message TEXT,
        course_id TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    
    // Insert course booking into database
    await sql`
      INSERT INTO course_bookings (
        id, name, email, phone, course_id, date, time, message, created_at
      ) VALUES (
        ${id}, ${name}, ${email}, ${phone || null}, ${courseId}, 
        ${date}, ${time}, ${message || null}, NOW()
      )
    `

    console.log(`Course booking created: ${id}`)
    
    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error("Error creating course booking:", error)
    return NextResponse.json(
      { error: "Failed to create course booking" },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    // Check if table exists, if not create it
    await sql`
      CREATE TABLE IF NOT EXISTS course_bookings (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        date DATE NOT NULL,
        time TEXT NOT NULL,
        message TEXT,
        course_id TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    
    // Get query parameters
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    // If id is provided, get specific course booking
    if (id) {
      const courseBooking = await sql`
        SELECT 
          id, 
          name, 
          email, 
          phone, 
          course_id as "courseId", 
          date, 
          time, 
          message, 
          status,
          created_at as "createdAt"
        FROM course_bookings 
        WHERE id = ${id}
      `

      if (courseBooking.length === 0) {
        return NextResponse.json(
          { error: "Course booking not found" },
          { status: 404 }
        )
      }

      return NextResponse.json(courseBooking[0])
    }

    // Otherwise, get all course bookings (sorted by date and time)
    const courseBookings = await sql`
      SELECT 
        id, 
        name, 
        email, 
        phone, 
        course_id as "courseId", 
        date, 
        time, 
        message, 
        status,
        created_at as "createdAt"
      FROM course_bookings 
      ORDER BY date ASC, time ASC
    `

    return NextResponse.json(courseBookings)
  } catch (error) {
    console.error("Error fetching course bookings:", error)
    return NextResponse.json(
      { error: "Failed to fetch course bookings" },
      { status: 500 }
    )
  }
}
