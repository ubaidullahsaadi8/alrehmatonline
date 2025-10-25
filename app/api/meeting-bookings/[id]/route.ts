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

    
    const result = await sql`
      UPDATE meeting_bookings
      SET status = ${status}
      WHERE id = ${id}
      RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Meeting booking not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, id, status })
  } catch (error) {
    console.error("Error updating meeting booking status:", error)
    return NextResponse.json(
      { error: "Failed to update meeting booking status" },
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

    // Delete meeting booking
    const result = await sql`
      DELETE FROM meeting_bookings
      WHERE id = ${id}
      RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Meeting booking not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error("Error deleting meeting booking:", error)
    return NextResponse.json(
      { error: "Failed to delete meeting booking" },
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
  } catch (error) {
    console.error("Error fetching meeting booking:", error)
    return NextResponse.json(
      { error: "Failed to fetch meeting booking" },
      { status: 500 }
    )
  }
}
