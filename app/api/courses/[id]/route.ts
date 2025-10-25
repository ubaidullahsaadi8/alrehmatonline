import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const course = await sql`
      SELECT * FROM courses WHERE id = ${id} LIMIT 1
    `

    if (course.length === 0) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    return NextResponse.json(course[0])
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch course" }, { status: 500 })
  }
}
