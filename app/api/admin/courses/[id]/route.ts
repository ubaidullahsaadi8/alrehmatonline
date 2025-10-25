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

    
    const courses = await sql`
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
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM courses 
      WHERE id = ${id}
    `

    if (courses.length === 0) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(courses[0])
  } catch (error) {
    console.error("Error fetching course:", error)
    return NextResponse.json(
      { error: "Failed to fetch course" },
      { status: 500 }
    )
  }
}

// Update a course
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

    // Get course data from request
    const { 
      title, 
      description, 
      image, 
      price, 
      duration, 
      level,
      instructor,
      category,
      featured 
    } = await req.json()

    // Validate required fields
    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      )
    }

    // Check if course exists
    const existingCourses = await sql`SELECT id FROM courses WHERE id = ${id}`
    
    if (existingCourses.length === 0) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      )
    }

    // Update course
    await sql`
      UPDATE courses
      SET 
        title = ${title},
        description = ${description},
        image = ${image || '/placeholder.jpg'},
        price = ${price || 0},
        duration = ${duration || 'N/A'},
        level = ${level || 'Beginner'},
        instructor = ${instructor || 'TBD'},
        category = ${category || 'General'},
        featured = ${featured || false},
        updated_at = NOW()
      WHERE id = ${id}
    `

    return NextResponse.json({ 
      success: true, 
      message: "Course updated successfully" 
    })
  } catch (error) {
    console.error("Error updating course:", error)
    return NextResponse.json(
      { error: "Failed to update course" },
      { status: 500 }
    )
  }
}

// Delete a course
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

    // Delete the course
    await sql`DELETE FROM courses WHERE id = ${id}`

    return NextResponse.json({ 
      success: true,
      message: "Course deleted successfully" 
    })
  } catch (error) {
    console.error("Error deleting course:", error)
    return NextResponse.json(
      { error: "Failed to delete course" },
      { status: 500 }
    )
  }
}
