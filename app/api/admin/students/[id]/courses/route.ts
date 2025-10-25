import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const user = await getSession()
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const { id: studentId } = await params
    console.log(`Fetching courses for student: ${studentId}`)
    
    
    const checkTable = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'student_courses'
      ) as exists
    `
    
    const tableExists = checkTable[0]?.exists
    
    if (!tableExists) {
      console.log("student_courses table does not exist yet, returning empty array")
      return NextResponse.json([], { status: 200 })
    }
    
    const result = await sql`
      SELECT 
        sc.id,
        c.title,
        c.description,
        c.category,
        sc.status,
        sc.total_fee as fee,
        sc.paid_amount,
        sc.enrollment_date as start_date,
        sc.completion_date as end_date,
        sc.created_at
      FROM 
        student_courses sc
      JOIN
        courses c ON sc.course_id = c.id
      WHERE 
        sc.student_id = ${studentId}
      ORDER BY 
        sc.created_at DESC
    `
    
    console.log(`Found ${result.length} courses for student ${studentId}`)
    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error("Error fetching student courses:", error)
    return NextResponse.json(
      { error: "Failed to fetch student courses" },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const user = await getSession()
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const { id: studentId } = await params
    const body = await request.json()
    
    const { courseId, status = 'enrolled', notes } = body
    
    console.log(`Assigning course ${courseId} to student ${studentId}`)
    console.log('Request body:', body)
    
    // Validate required fields
    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      )
    }
    
    // Verify course exists (but don't use course price as default fee)
    console.log('Verifying course exists for courseId:', courseId)
    const courseDetails = await sql`
      SELECT id FROM courses WHERE id = ${courseId}
    `
    
    console.log('Course details result:', courseDetails)
    
    if (courseDetails.length === 0) {
      console.log('Course not found:', courseId)
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      )
    }
    
    // No default fee - teacher will set fee manually for each student
    const courseFee = null
    console.log('Course fee: null (no default fee)')
    
    // Check if student_courses table exists, create if not
    console.log('Checking if student_courses table exists...')
    const checkTable = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'student_courses'
      ) as exists
    `
    
    const tableExists = checkTable[0]?.exists
    console.log('Table exists:', tableExists)
    
    if (!tableExists) {
      console.log("Creating student_courses table...")
      await sql`
        CREATE TABLE student_courses (
          id SERIAL PRIMARY KEY,
          student_id TEXT NOT NULL,
          course_id TEXT NOT NULL,
          status TEXT DEFAULT 'enrolled',
          fee DECIMAL(10,2),
          discount DECIMAL(5,2) DEFAULT 0,
          paid_amount DECIMAL(10,2) DEFAULT 0,
          due_date DATE,
          notes TEXT,
          start_date DATE DEFAULT CURRENT_DATE,
          end_date DATE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(student_id, course_id)
        )
      `
      console.log("Table created successfully")
    }
    
    // Check if course assignment already exists
    console.log('Checking for existing assignment...')
    const existing = await sql`
      SELECT id FROM student_courses 
      WHERE student_id = ${studentId} AND course_id = ${courseId}
    `
    
    console.log('Existing assignments found:', existing.length)
    
    if (existing.length > 0) {
      console.log('Student already enrolled in this course')
      return NextResponse.json(
        { error: "Student is already enrolled in this course" },
        { status: 400 }
      )
    }
    
    // Insert the course assignment
    console.log('Inserting course assignment with data:', {
      studentId, courseId, status, notes
    })
    
    // Generate UUID for id field
    const id = crypto.randomUUID()
    console.log('Generated ID:', id)
    
    const result = await sql`
      INSERT INTO student_courses (
        id, student_id, course_id, status, total_fee, paid_amount
      ) VALUES (
        ${id}, ${studentId}, ${courseId}, ${status}, 0, 0
      )
      RETURNING id, student_id, course_id, status, total_fee, created_at
    `
    
    console.log('Insert result:', result)
    console.log(`Successfully assigned course ${courseId} to student ${studentId}`)
    
    return NextResponse.json(result[0], { status: 201 })
  } catch (error: any) {
    console.error("Error assigning course to student:", error)
    console.error("Error details:", error.message)
    console.error("Error stack:", error.stack)
    return NextResponse.json(
      { error: "Failed to assign course to student", details: error.message },
      { status: 500 }
    )
  }
}
