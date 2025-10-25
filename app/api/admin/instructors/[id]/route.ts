import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const instructorId = params.id
    console.log(`Fetching details for instructor: ${instructorId}`)
    
    
    const user = await getSession()
    if (!user || user.role !== "admin") {
      console.log("Unauthorized attempt to access instructor details")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    
    const instructors = await sql`
      SELECT 
        id,
        name,
        email,
        role,
        avatar,
        phone,
        whatsapp,
        telegram,
        secondary_email,
        address,
        notes,
        active,
        is_approved,
        account_status,
        education,
        country,
        created_at,
        last_login,
        currency
      FROM users
      WHERE id = ${instructorId} AND user_type = 'instructor'
      LIMIT 1
    `
    
    if (!instructors || instructors.length === 0) {
      return NextResponse.json(
        { error: "Instructor not found" }, 
        { status: 404 }
      )
    }
    
    return NextResponse.json(instructors[0])
  } catch (error) {
    console.error("Error fetching instructor details:", error)
    return NextResponse.json(
      { error: "Failed to fetch instructor details" }, 
      { status: 500 }
    )
  }
}
