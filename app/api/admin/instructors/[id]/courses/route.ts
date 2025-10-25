import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const instructorId = params.id
    console.log(`Fetching courses for instructor: ${instructorId}`)
    
    // Validate instructor ID
    if (!instructorId) {
      console.error("Missing instructor ID")
      return NextResponse.json({ error: "Instructor ID is required" }, { status: 400 })
    }
    
    const user = await getSession()
    if (!user || user.role !== "admin") {
      console.log("Unauthorized attempt to access instructor courses")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    // Verify instructor exists and get their details
    const instructors = await sql`
      SELECT id, name, user_type, is_approved, active 
      FROM users 
      WHERE id = ${instructorId}
      AND user_type = 'instructor'
      LIMIT 1
    `
    
    console.log("Found instructor:", instructors?.[0])
    
    if (!instructors || instructors.length === 0) {
      console.error(`Instructor not found: ${instructorId}`)
      return NextResponse.json({ error: "Instructor not found" }, { status: 404 })
    }
    
    const instructor = instructors[0]
    
    if (!instructor.is_approved || !instructor.active) {
      console.error(`Instructor ${instructorId} is not approved or active`)
      return NextResponse.json({ error: "Instructor is not approved or active" }, { status: 403 })
    }
    
    if (!instructor || instructor.length === 0) {
      console.error(`Instructor not found: ${instructorId}`)
      return NextResponse.json({ error: "Instructor not found" }, { status: 404 })
    }
    
    
    // Fetch instructor's courses with student count and other instructors
    const result = await sql`
      WITH student_counts AS (
        SELECT 
          course_id,
          COUNT(*)::int as active_students
        FROM student_courses
        WHERE status = 'active'
        GROUP BY course_id
      )
      SELECT 
        c.id,
        c.title,
        c.description,
        c.image,
        c.level,
        c.duration,
        c.category,
        ci.status as assignment_status,
        ci.assigned_at as start_date,
        ci.role as instructor_role,
        COALESCE(sc.active_students, 0) as students_count,
        COALESCE(
          (
            SELECT json_agg(json_build_object(
              'id', u.id,
              'name', u.name,
              'role', COALESCE(ci2.role, 'instructor'),
              'status', ci2.status
            ))
            FROM course_instructors ci2
            JOIN users u ON ci2.instructor_id = u.id
            WHERE ci2.course_id = c.id
            AND ci2.status = 'active'
          ),
          '[]'::json
        ) as all_instructors
      FROM courses c
      JOIN course_instructors ci ON c.id = ci.course_id
      LEFT JOIN student_counts sc ON c.id = sc.course_id
      WHERE ci.instructor_id = ${instructorId}
      AND ci.status = 'active'
      ORDER BY ci.assigned_at DESC
    `
    
    console.log(`Found ${result?.length || 0} courses for instructor ${instructorId}`)
    
    console.log(`Found ${result ? result.length : 0} courses for instructor ${instructorId}`)
    return NextResponse.json(result || [])
  } catch (error) {
    console.error("Error fetching instructor courses:", error)
    // Log detailed error information
    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name
      })
    }
    return NextResponse.json(
      { error: "Failed to fetch instructor courses" }, 
      { status: 500 }
    )
  }
}

/**
 * API endpoint for assigning a course to an instructor
 * POST /api/admin/instructors/[id]/courses
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const instructorId = params.id
    console.log(`Assigning course to instructor: ${instructorId}`)
    
    // Check for admin authorization
    const user = await getSession()
    if (!user || user.role !== "admin") {
      console.log("Unauthorized attempt to assign course to instructor")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const body = await req.json()
    const { courseId, startDate, endDate } = body
    
    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" }, 
        { status: 400 }
      )
    }
    
    // Check if course exists
    const course = await sql`
      SELECT id, title, description FROM courses WHERE id = ${courseId} LIMIT 1
    `
    
    if (!course || course.length === 0) {
      return NextResponse.json(
        { error: "Course not found" }, 
        { status: 404 }
      )
    }
    
    // Check if instructor already has this course assigned
    const existingAssignment = await sql`
      SELECT id FROM course_instructors 
      WHERE course_id = ${courseId} AND instructor_id = ${instructorId} LIMIT 1
    `
    
    if (existingAssignment && existingAssignment.length > 0) {
      return NextResponse.json(
        { error: "Course is already assigned to this instructor" }, 
        { status: 400 }
      )
    }
    
    // Assign course to instructor
    const assignment = await sql`
      INSERT INTO course_instructors (
        course_id, 
        instructor_id, 
        status,
        role,
        assigned_at
      )
      VALUES (
        ${courseId},
        ${instructorId},
        'active',
        'instructor',
        CURRENT_TIMESTAMP
      )
      RETURNING id, course_id, instructor_id, status, assigned_at
    `
    
    if (!assignment || assignment.length === 0) {
      return NextResponse.json(
        { error: "Failed to assign course to instructor" }, 
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: "Course assigned to instructor successfully",
      assignment: assignment[0]
    })
  } catch (error) {
    console.error("Error assigning course to instructor:", error)
    return NextResponse.json(
      { error: "Failed to assign course to instructor" }, 
      { status: 500 }
    )
  }
}
