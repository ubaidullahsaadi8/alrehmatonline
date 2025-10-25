import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, courseId, serviceId, date, time, message } = await req.json()

    
    if (!name || !email || !date || !time) {
      return NextResponse.json(
        { error: "Name, email, date, and time are required" },
        { status: 400 }
      )
    }

    const id = crypto.randomUUID()

    
    await sql`
      INSERT INTO meeting_bookings (
        id, name, email, phone, course_id, service_id, date, time, message, created_at
      ) VALUES (
        ${id}, ${name}, ${email}, ${phone || null}, ${courseId || null}, ${serviceId || null}, 
        ${date}, ${time}, ${message || null}, NOW()
      )
    `

    console.log(`Meeting booking created: ${id}`)
    
    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error("Error creating meeting booking:", error)
    return NextResponse.json(
      { error: "Failed to create meeting booking" },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    // If id is provided, get specific meeting booking
    if (id) {
      const meetingBooking = await sql`
        SELECT 
          id, 
          name, 
          email, 
          phone, 
          course_id as "courseId", 
          service_id as "serviceId", 
          date, 
          time, 
          message, 
          status,
          created_at as "createdAt"
        FROM meeting_bookings 
        WHERE id = ${id}
      `

      if (meetingBooking.length === 0) {
        return NextResponse.json(
          { error: "Meeting booking not found" },
          { status: 404 }
        )
      }

      return NextResponse.json(meetingBooking[0])
    }

    // Otherwise, get all meeting bookings (sorted by date and time)
    const meetingBookings = await sql`
      SELECT 
        id, 
        name, 
        email, 
        phone, 
        course_id as "courseId", 
        service_id as "serviceId", 
        date, 
        time, 
        message, 
        status,
        created_at as "createdAt"
      FROM meeting_bookings 
      ORDER BY date ASC, time ASC
    `

    return NextResponse.json(meetingBookings)
  } catch (error) {
    console.error("Error fetching meeting bookings:", error)
    return NextResponse.json(
      { error: "Failed to fetch meeting bookings" },
      { status: 500 }
    )
  }
}
