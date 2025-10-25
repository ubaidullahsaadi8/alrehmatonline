import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const { status } = await req.json()

    
    const validStatuses = ["pending", "contacted", "completed", "cancelled"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be one of: pending, contacted, completed, cancelled" },
        { status: 400 }
      )
    }
    
    
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

    // Update course request status
    const result = await sql`
      UPDATE course_requests
      SET status = ${status}
      WHERE id = ${id}
      RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Course request not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, id, status })
  } catch (error) {
    console.error("Error updating course request status:", error)
    return NextResponse.json(
      { error: "Failed to update course request status" },
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

    // Delete course request
    const result = await sql`
      DELETE FROM course_requests
      WHERE id = ${id}
      RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Course request not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error("Error deleting course request:", error)
    return NextResponse.json(
      { error: "Failed to delete course request" },
      { status: 500 }
    )
  }
}
