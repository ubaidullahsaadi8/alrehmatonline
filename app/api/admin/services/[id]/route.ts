import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"


export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    
    const user = await getSession()
    
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = params.id

    
    const services = await sql`
      SELECT 
        id, 
        title, 
        description,
        image,
        features,
        price,
        featured,
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM services 
      WHERE id = ${id}
    `

    if (services.length === 0) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(services[0])
  } catch (error) {
    console.error("Error fetching service:", error)
    return NextResponse.json(
      { error: "Failed to fetch service" },
      { status: 500 }
    )
  }
}

// Update a service
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check for admin authorization
    const user = await getSession()
    
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = params.id

    // Get service data from request
    const { title, description, imageUrl, content, price, featured } = await req.json()

    // Validate required fields
    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      )
    }

    // Check if service exists
    const existingServices = await sql`SELECT id FROM services WHERE id = ${id}`
    
    if (existingServices.length === 0) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      )
    }

    // Update service
    await sql`
      UPDATE services
      SET 
        title = ${title},
        description = ${description},
        image = ${imageUrl || '/placeholder.jpg'},
        features = ${content ? [content] : []},
        price = ${price ? String(price) : '0'},
        featured = ${featured || false},
        updated_at = NOW()
      WHERE id = ${id}
    `

    return NextResponse.json({ 
      success: true, 
      message: "Service updated successfully" 
    })
  } catch (error) {
    console.error("Error updating service:", error)
    return NextResponse.json(
      { error: "Failed to update service" },
      { status: 500 }
    )
  }
}

// Delete a service
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check for admin authorization
    const user = await getSession()
    
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = params.id

    // Delete the service
    await sql`DELETE FROM services WHERE id = ${id}`

    return NextResponse.json({ 
      success: true,
      message: "Service deleted successfully" 
    })
  } catch (error) {
    console.error("Error deleting service:", error)
    return NextResponse.json(
      { error: "Failed to delete service" },
      { status: 500 }
    )
  }
}
