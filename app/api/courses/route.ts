import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    
    const { searchParams } = new URL(req.url)
    const featured = searchParams.get("featured")
    
    
    let coursesQuery
    
    if (featured === "true") {
      coursesQuery = await sql`
        SELECT 
          id, 
          title, 
          description,
          image,
          content,
          price,
          duration,
          level,
          instructor,
          category,
          featured,
          created_at as "createdAt"
        FROM courses 
        WHERE featured = true
        ORDER BY created_at DESC
      `
    } else {
      coursesQuery = await sql`
        SELECT 
          id, 
          title, 
          description,
          image,
          price,
          duration,
          level,
          instructor,
          category,
          featured,
          created_at as "createdAt"
        FROM courses 
        ORDER BY featured DESC, created_at DESC
      `
    }
    
    
    
    return NextResponse.json({ courses: coursesQuery })
  } catch (error) {
    console.error("Error fetching courses:", error)
    return NextResponse.json(
      { error: "Failed to fetch courses" }, 
      { status: 500 }
    )
  }
}
