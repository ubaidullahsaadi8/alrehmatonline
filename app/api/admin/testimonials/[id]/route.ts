import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    
    const user = await getSession()
    
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    
    if (!id) {
      return NextResponse.json({ error: "Testimonial ID is required" }, { status: 400 })
    }

    const result = await sql`
      SELECT *
      FROM testimonials
      WHERE id = ${id}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error fetching testimonial:", error)
    return NextResponse.json(
      { error: "Failed to fetch testimonial" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check for admin authorization
    const user = await getSession()
    
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    
    if (!id) {
      return NextResponse.json({ error: "Testimonial ID is required" }, { status: 400 })
    }

    const body = await request.json()
    const { name, role, company, content, avatar, rating, featured } = body
    
    // Validate required fields
    if (!name || !role || !company || !content || rating === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" }, 
        { status: 400 }
      )
    }

    // Update testimonial in the database
    const result = await sql`
      UPDATE testimonials
      SET 
        name = ${name}, 
        role = ${role}, 
        company = ${company}, 
        content = ${content},
        avatar = ${avatar},
        rating = ${rating},
        featured = ${featured}
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating testimonial:", error)
    return NextResponse.json(
      { error: "Failed to update testimonial" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check for admin authorization
    const user = await getSession()
    
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    
    if (!id) {
      return NextResponse.json({ error: "Testimonial ID is required" }, { status: 400 })
    }

    // Delete testimonial from the database
    const result = await sql`
      DELETE FROM testimonials
      WHERE id = ${id}
      RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error("Error deleting testimonial:", error)
    return NextResponse.json(
      { error: "Failed to delete testimonial" },
      { status: 500 }
    )
  }
}
