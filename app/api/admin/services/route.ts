import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"


export async function GET(req: NextRequest) {
  try {
    console.log("Fetching services from API");
    
    
    const user = await getSession()
    console.log("User session:", user ? { id: user.id, role: user.role } : "No session");
    
    if (!user || user.role !== "admin") {
      console.log("Unauthorized access attempt to services API");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    
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
      ORDER BY created_at DESC
    `
    
    console.log(`Fetched ${services ? services.length : 0} services`);
    
    
    const servicesToReturn = services || [];
    
    return NextResponse.json(servicesToReturn)
  } catch (error) {
    console.error("Error fetching services:", error)
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    )
  }
}


export async function POST(req: NextRequest) {
  try {
    
    const user = await getSession()
    
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    
    const { title, description, imageUrl, content, price, featured } = await req.json()

    
    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      )
    }

    const id = `service-${Date.now()}`

    
    await sql`
      INSERT INTO services (
        id, 
        title, 
        description, 
        image, 
        features, 
        price, 
        featured
      ) VALUES (
        ${id},
        ${title},
        ${description},
        ${imageUrl || '/placeholder.jpg'},
        ${content ? [content] : []}, 
        ${price ? String(price) : '0'},
        ${featured || false}
      )
    `

    return NextResponse.json({ 
      success: true, 
      message: "Service created successfully",
      id 
    })
  } catch (error) {
    console.error("Error creating service:", error)
    return NextResponse.json(
      { error: "Failed to create service" },
      { status: 500 }
    )
  }
}
