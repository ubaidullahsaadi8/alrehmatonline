import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"

// Get teacher's salary records
export async function GET(req: NextRequest) {
  try {
    const teacher = await getSession()
    
    if (!teacher || (teacher.role !== "instructor" && teacher.user_type !== "instructor")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch teacher info with currency
    const teacherInfo = await sql`
      SELECT id, name, email, currency
      FROM users
      WHERE id = ${teacher.id}
      LIMIT 1
    `

    // Fetch all salary records for this teacher
    const salaryRecords = await sql`
      SELECT 
        id,
        instructor_id,
        month,
        year,
        amount,
        status,
        payment_date,
        notes,
        created_at
      FROM instructor_salary
      WHERE instructor_id = ${teacher.id}
      ORDER BY year DESC, month DESC
    `

    return NextResponse.json({
      teacher: teacherInfo[0],
      salaryRecords
    })
  } catch (error) {
    console.error("Error fetching salary records:", error)
    return NextResponse.json(
      { error: "Failed to fetch salary records" },
      { status: 500 }
    )
  }
}
