import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    
    const { searchParams } = new URL(req.url)
    const featured = searchParams.get("featured")
    
    
    let servicesQuery
    
    if (featured === "true") {
      servicesQuery = await sql`
        SELECT 
          id, 
          title, 
          description,
          image,
          features,
          price,
          featured,
          created_at as "createdAt"
        FROM services 
        WHERE featured = true
        ORDER BY created_at DESC
      `
    } else {
      servicesQuery = await sql`
        SELECT 
          id, 
          title, 
          description,
          image,
          features,
          price,
          featured,
          created_at as "createdAt"
        FROM services 
        ORDER BY featured DESC, created_at DESC
      `
    }
    
    
    
    return NextResponse.json({ services: servicesQuery })
  } catch (error) {
    console.error("Error fetching services:", error)
    return NextResponse.json(
      { error: "Failed to fetch services" }, 
      { status: 500 }
    )
  }
}
