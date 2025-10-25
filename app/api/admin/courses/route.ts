import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"


export async function GET(req: NextRequest) {
  try {
    console.log("Fetching courses from API");
    
    
    const user = await getSession()
    console.log("User session:", user ? { id: user.id, role: user.role } : "No session");
    
    if (!user || user.role !== "admin") {
      console.log("Unauthorized access attempt to courses API");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    
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
      ORDER BY created_at DESC
    `
    
    console.log(`Fetched ${courses ? courses.length : 0} courses`);
    
    
    const coursesToReturn = courses || [];
    
    return NextResponse.json(coursesToReturn)
  } catch (error) {
    console.error("Error fetching courses:", error)
    return NextResponse.json(
      { error: "Failed to fetch courses" },
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

    
    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      )
    }

    
    const id = `course_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`

    
    console.log("Creating course with data:", {
      id, title, description, image, price, duration, level, instructor, category, featured
    })

    
    await sql`
      INSERT INTO courses (
        id, 
        title, 
        description, 
        image, 
        price,
        duration,
        level,
        instructor,
        category,
        featured
      ) VALUES (
        ${id},
        ${title},
        ${description},
        ${image || '/placeholder.jpg'},
        ${price || 0},
        ${duration || 'N/A'},
        ${level || 'Beginner'},
        ${instructor || 'TBD'},
        ${category || 'General'},
        ${featured || false}
      )
    `

    // Return created course details
    const createdCourse = await sql`
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

    return NextResponse.json({ 
      success: true, 
      message: "Course created successfully",
      course: createdCourse[0]
    })
  } catch (error) {
    console.error("Error creating course:", error)
    
    // Detailed error message for debugging
    let errorMessage = "Failed to create course";
    if (error instanceof Error) {
      errorMessage += `: ${error.message}`;
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
