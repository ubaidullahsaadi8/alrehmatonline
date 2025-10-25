import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const { status } = await req.json()

    
    const validStatuses = ["pending", "confirmed", "completed", "cancelled"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be one of: pending, confirmed, completed, cancelled" },
        { status: 400 }
      )
    }
    
    
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

    // Update course booking status
    const result = await sql`
      UPDATE course_bookings
      SET status = ${status}
      WHERE id = ${id}
      RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Course booking not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, id, status })
  } catch (error) {
    console.error("Error updating course booking status:", error)
    return NextResponse.json(
      { error: "Failed to update course booking status" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
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

    // Delete course booking
    const result = await sql`
      DELETE FROM course_bookings
      WHERE id = ${id}
      RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Course booking not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error("Error deleting course booking:", error)
    return NextResponse.json(
      { error: "Failed to delete course booking" },
      { status: 500 }
    )
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
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
  } catch (error) {
    console.error("Error fetching course booking:", error)
    return NextResponse.json(
      { error: "Failed to fetch course booking" },
      { status: 500 }
    )
  }
}
