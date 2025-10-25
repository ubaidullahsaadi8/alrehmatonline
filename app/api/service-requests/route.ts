import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, courseId, serviceId, message } = await req.json()

    
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      )
    }

    const id = crypto.randomUUID()

    
    await sql`
      CREATE TABLE IF NOT EXISTS service_requests (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        message TEXT NOT NULL,
        course_id TEXT,
        service_id TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    
    // Insert service request into database
    await sql`
      INSERT INTO service_requests (
        id, name, email, phone, course_id, service_id, message, created_at
      ) VALUES (
        ${id}, ${name}, ${email}, ${phone || null}, ${courseId || null}, ${serviceId || null}, ${message}, NOW()
      )
    `

    console.log(`Service request created: ${id}`)
    
    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error("Error creating service request:", error)
    return NextResponse.json(
      { error: "Failed to create service request" },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    // Check if table exists, if not create it
    await sql`
      CREATE TABLE IF NOT EXISTS service_requests (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        message TEXT NOT NULL,
        course_id TEXT,
        service_id TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    
    // Get query parameters
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    // If id is provided, get specific service request
    if (id) {
      const serviceRequest = await sql`
        SELECT 
          id, 
          name, 
          email, 
          phone, 
          course_id as "courseId", 
          service_id as "serviceId", 
          message, 
          status,
          created_at as "createdAt"
        FROM service_requests 
        WHERE id = ${id}
      `

      if (serviceRequest.length === 0) {
        return NextResponse.json(
          { error: "Service request not found" },
          { status: 404 }
        )
      }

      return NextResponse.json(serviceRequest[0])
    }

    // Otherwise, get all service requests (sorted by creation date, newest first)
    const serviceRequests = await sql`
      SELECT 
        id, 
        name, 
        email, 
        phone, 
        course_id as "courseId", 
        service_id as "serviceId", 
        message, 
        status,
        created_at as "createdAt"
      FROM service_requests 
      ORDER BY created_at DESC
    `

    return NextResponse.json(serviceRequests)
  } catch (error) {
    console.error("Error fetching service requests:", error)
    return NextResponse.json(
      { error: "Failed to fetch service requests" },
      { status: 500 }
    )
  }
}
