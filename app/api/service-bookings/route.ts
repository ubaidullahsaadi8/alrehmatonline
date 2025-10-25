import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, serviceId, date, time, message } = await req.json()

    
    if (!name || !email || !date || !time || !serviceId) {
      return NextResponse.json(
        { error: "Name, email, service, date, and time are required" },
        { status: 400 }
      )
    }

    const id = crypto.randomUUID()

    
    await sql`
      CREATE TABLE IF NOT EXISTS service_bookings (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        date DATE NOT NULL,
        time TEXT NOT NULL,
        message TEXT,
        service_id TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    
    // Insert service booking into database
    await sql`
      INSERT INTO service_bookings (
        id, name, email, phone, service_id, date, time, message, created_at
      ) VALUES (
        ${id}, ${name}, ${email}, ${phone || null}, ${serviceId}, 
        ${date}, ${time}, ${message || null}, NOW()
      )
    `

    console.log(`Service booking created: ${id}`)
    
    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error("Error creating service booking:", error)
    return NextResponse.json(
      { error: "Failed to create service booking" },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    // Check if table exists, if not create it
    await sql`
      CREATE TABLE IF NOT EXISTS service_bookings (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        date DATE NOT NULL,
        time TEXT NOT NULL,
        message TEXT,
        service_id TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    
    // Get query parameters
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    // If id is provided, get specific service booking
    if (id) {
      const serviceBooking = await sql`
        SELECT 
          id, 
          name, 
          email, 
          phone, 
          service_id as "serviceId", 
          date, 
          time, 
          message, 
          status,
          created_at as "createdAt"
        FROM service_bookings 
        WHERE id = ${id}
      `

      if (serviceBooking.length === 0) {
        return NextResponse.json(
          { error: "Service booking not found" },
          { status: 404 }
        )
      }

      return NextResponse.json(serviceBooking[0])
    }

    // Otherwise, get all service bookings (sorted by date and time)
    const serviceBookings = await sql`
      SELECT 
        id, 
        name, 
        email, 
        phone, 
        service_id as "serviceId", 
        date, 
        time, 
        message, 
        status,
        created_at as "createdAt"
      FROM service_bookings 
      ORDER BY date ASC, time ASC
    `

    return NextResponse.json(serviceBookings)
  } catch (error) {
    console.error("Error fetching service bookings:", error)
    return NextResponse.json(
      { error: "Failed to fetch service bookings" },
      { status: 500 }
    )
  }
}
