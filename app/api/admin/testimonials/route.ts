import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"
import { randomUUID } from "crypto"

export async function GET() {
  try {
    
    const testimonials = await sql`
      SELECT * FROM testimonials 
      ORDER BY created_at DESC
    `
    return NextResponse.json(testimonials)
  } catch (error) {
    console.error("Error fetching testimonials:", error)
    return NextResponse.json(
      { error: "Failed to fetch testimonials" }, 
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check for admin authorization
    const user = await getSession()
    
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse and validate request body
    const body = await request.json()
    const { name, role, company, content, avatar, rating, featured } = body

    // Validate required fields
    if (!name || !role || !company || !content || rating === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" }, 
        { status: 400 }
      )
    }

    // Generate a unique ID using the imported randomUUID function
    const id = randomUUID();
    console.log("Generated ID:", id);

    // Insert the testimonial into the database
    const result = await sql`
      INSERT INTO testimonials (
        id, 
        name, 
        role, 
        company, 
        content, 
        avatar, 
        rating, 
        featured,
        created_at
      )
      VALUES (
        ${id}, 
        ${name}, 
        ${role}, 
        ${company}, 
        ${content}, 
        ${avatar || '/placeholder-user.jpg'}, 
        ${rating}, 
        ${featured || false},
        NOW()
      )
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating testimonial:", error)
    let errorMessage = "Failed to create testimonial";
    
    // If it's an error object with message property, include it
    if (error instanceof Error) {
      errorMessage += `: ${error.message}`;
    }
    
    return NextResponse.json(
      { error: errorMessage }, 
      { status: 500 }
    )
  }
}
