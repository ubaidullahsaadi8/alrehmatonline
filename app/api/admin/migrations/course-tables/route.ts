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

    
    const courseReqCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'course_requests'
      );
    `
    
    if (!courseReqCheck[0].exists) {
      await sql`
        CREATE TABLE course_requests (
          id UUID PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          phone VARCHAR(20),
          course_id UUID,
          message TEXT NOT NULL,
          status VARCHAR(20) NOT NULL DEFAULT 'pending',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `
      console.log("Successfully created 'course_requests' table")
    }
    
    // Create the course_bookings table if it doesn't exist
    const courseBookCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'course_bookings'
      );
    `
    
    if (!courseBookCheck[0].exists) {
      await sql`
        CREATE TABLE course_bookings (
          id UUID PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          phone VARCHAR(20),
          course_id UUID NOT NULL,
          date DATE NOT NULL,
          time TIME NOT NULL,
          message TEXT,
          status VARCHAR(20) NOT NULL DEFAULT 'pending',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `
      console.log("Successfully created 'course_bookings' table")
    }
    
    return NextResponse.json({ 
      message: "Database migration completed successfully!", 
      success: true,
      tables: {
        course_requests: courseReqCheck[0].exists ? "already exists" : "created",
        course_bookings: courseBookCheck[0].exists ? "already exists" : "created"
      }
    })
  } catch (error) {
    console.error("Error in migration:", error)
    return NextResponse.json({ 
      error: "Migration failed", 
      details: (error as Error).message 
    }, { status: 500 })
  }
}
