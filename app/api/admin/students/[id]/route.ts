import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    
    const { id: studentId } = await params
    console.log(`Fetching details for student: ${studentId}`)
    
    const result = await sql`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.avatar,
        u.country,
        u.phone,
        u.active,
        u.account_status,
        u.is_approved,
        u.created_at
      FROM 
        users u
      WHERE 
        u.id = ${studentId}
        AND u.role = 'student'
    `
    
    if (result.length === 0) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      )
    }
    
    return NextResponse.json(result[0], { status: 200 })
  } catch (error) {
    console.error("Error fetching student:", error)
    return NextResponse.json(
      { error: "Failed to fetch student details" },
      { status: 500 }
    )
  }
}
