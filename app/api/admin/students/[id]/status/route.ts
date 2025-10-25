import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const studentId = params.id
    const { active } = await request.json()
    
    const result = await sql`
      UPDATE users
      SET active = ${active},
          account_status = ${active ? 'active' : 'inactive'}
      WHERE id = ${studentId}
        AND role = 'student'
        AND is_approved = true
      RETURNING id, name, email, is_approved, active, account_status
    `
    
    if (result.length === 0) {
      return NextResponse.json(
        { error: "Student not found or not approved" },
        { status: 404 }
      )
    }
    
    return NextResponse.json(result[0], { status: 200 })
  } catch (error) {
    console.error("Error toggling student status:", error)
    return NextResponse.json(
      { error: "Failed to update student status" },
      { status: 500 }
    )
  }
}
