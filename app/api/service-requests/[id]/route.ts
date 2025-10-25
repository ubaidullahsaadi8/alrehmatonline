import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    
    const serviceRequests = await sql`
      SELECT 
        id, 
        name, 
        email, 
        phone,
        message,
        service_id as "serviceId",
        status,
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM service_requests 
      WHERE id = ${id}
    `

    if (serviceRequests.length === 0) {
      return NextResponse.json(
        { error: "Service request not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(serviceRequests[0])
  } catch (error) {
    console.error("Error fetching service request:", error)
    return NextResponse.json(
      { error: "Failed to fetch service request" },
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

    // Update service request
    await sql`
      UPDATE service_requests
      SET 
        status = ${status},
        updated_at = NOW()
      WHERE id = ${id}
    `

    return NextResponse.json({ 
      success: true, 
      message: "Service request updated successfully" 
    })
  } catch (error) {
    console.error("Error updating service request:", error)
    return NextResponse.json(
      { error: "Failed to update service request" },
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

    // Delete the service request
    await sql`
      DELETE FROM service_requests 
      WHERE id = ${id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting service request:", error)
    return NextResponse.json(
      { error: "Failed to delete service request" },
      { status: 500 }
    )
  }
}
