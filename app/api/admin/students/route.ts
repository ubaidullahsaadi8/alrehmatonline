import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    
    const checkTable = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'student_courses'
      ) as exists
    `
    
    const studentCoursesExists = checkTable[0]?.exists || false
    
    let result;
    
    if (studentCoursesExists) {
      // If student_courses table exists, use the original query with the join
      result = await sql`
        SELECT 
          u.id,
          u.name,
          u.email,
          u.avatar,
          u.country,
          u.active,
          u.account_status,
          u.is_approved,
          u.created_at,
          COUNT(sc.id) as courses_count
        FROM 
          users u
        LEFT JOIN 
          student_courses sc ON u.id = sc.student_id
        WHERE 
          u.role = 'student'
        GROUP BY 
          u.id
        ORDER BY 
          u.created_at DESC
      `
    } else {
      // If student_courses table doesn't exist yet, use a simpler query
      result = await sql`
        SELECT 
          u.id,
          u.name,
          u.email,
          u.avatar,
          u.country,
          u.active,
          u.account_status,
          u.is_approved,
          u.created_at,
          0 as courses_count
        FROM 
          users u
        WHERE 
          u.role = 'student'
        ORDER BY 
          u.created_at DESC
      `
    }
    
    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error("Error fetching students:", error)
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 })
  }
}
