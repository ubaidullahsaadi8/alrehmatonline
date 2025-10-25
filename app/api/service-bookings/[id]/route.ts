import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    
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
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM service_bookings 
      WHERE id = ${id}
    `

    if (serviceBookings.length === 0) {
      return NextResponse.json(
        { error: "Service booking not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(serviceBookings[0])
  } catch (error) {
    console.error("Error fetching service booking:", error)
    return NextResponse.json(
      { error: "Failed to fetch service booking" },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check for admin authorization
    const user = await getSession()
    
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const { status } = await req.json()

    // Update service booking
    await sql`
      UPDATE service_bookings
      SET 
        status = ${status},
        updated_at = NOW()
      WHERE id = ${id}
    `

    return NextResponse.json({ 
      success: true, 
      message: "Service booking updated successfully" 
    })
  } catch (error) {
    console.error("Error updating service booking:", error)
    return NextResponse.json(
      { error: "Failed to update service booking" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check for admin authorization
    const user = await getSession()
    
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // Delete the service booking
    await sql`
      DELETE FROM service_bookings 
      WHERE id = ${id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting service booking:", error)
    return NextResponse.json(
      { error: "Failed to delete service booking" },
      { status: 500 }
    )
  }
}
