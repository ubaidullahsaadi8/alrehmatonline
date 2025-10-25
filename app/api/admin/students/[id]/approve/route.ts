import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const studentId = params.id
    const { approve } = await request.json()
    
    const result = await sql`
      UPDATE users
      SET is_approved = ${approve}, 
          active = ${approve}, 
          account_status = ${approve ? 'active' : 'pending'}
      WHERE id = ${studentId}
        AND role = 'student'
      RETURNING id, name, email, is_approved, active, account_status
    `
    
    if (result.length === 0) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      )
    }
    
    return NextResponse.json(result[0], { status: 200 })
  } catch (error) {
    console.error("Error approving student:", error)
    return NextResponse.json(
      { error: "Failed to update student approval status" },
      { status: 500 }
    )
  }
}
