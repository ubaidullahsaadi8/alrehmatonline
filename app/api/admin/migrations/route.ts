import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    
    const authCheckRes = await fetch(`${req.nextUrl.origin}/api/auth/check`, {
      headers: req.headers,
    })

    if (!authCheckRes.ok) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const authData = await authCheckRes.json()
    if (authData.role !== "admin") {
      return NextResponse.json({ error: "Admin privileges required" }, { status: 403 })
    }

    
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'meeting_bookings'
      );
    `
    
    if (tableCheck[0].exists) {
      return NextResponse.json({ 
        message: "Table 'meeting_bookings' already exists. Skipping creation.", 
        success: true 
      })
    }
    
    // Create the meeting_bookings table
    await sql`
      CREATE TABLE meeting_bookings (
        id UUID PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        course_id UUID,
        service_id UUID,
        date DATE NOT NULL,
        time TIME NOT NULL,
        message TEXT,
        status VARCHAR(20) NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `
    
    return NextResponse.json({ 
      message: "Successfully created 'meeting_bookings' table", 
      success: true 
    })
  } catch (error) {
    console.error("Error creating 'meeting_bookings' table:", error)
    return NextResponse.json({ 
      error: "Failed to create meeting_bookings table", 
      details: (error as Error).message 
    }, { status: 500 })
  }
}

// Optional: Check if the table exists
export async function GET(req: NextRequest) {
  try {
    // Check if user is authenticated and is an admin
    const authCheckRes = await fetch(`${req.nextUrl.origin}/api/auth/check`, {
      headers: req.headers,
    })

    if (!authCheckRes.ok) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const authData = await authCheckRes.json()
    if (authData.role !== "admin") {
      return NextResponse.json({ error: "Admin privileges required" }, { status: 403 })
    }

    
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'meeting_bookings'
      );
    `
    
    return NextResponse.json({ 
      exists: tableCheck[0].exists,
      tableName: "meeting_bookings"
    })
  } catch (error) {
    console.error("Error checking 'meeting_bookings' table:", error)
    return NextResponse.json({ 
      error: "Failed to check if meeting_bookings table exists", 
      details: (error as Error).message 
    }, { status: 500 })
  }
}
