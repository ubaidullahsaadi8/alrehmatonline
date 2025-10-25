import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    
    const testimonials = await sql`
      SELECT * FROM testimonials 
      ORDER BY featured DESC, created_at DESC 
      LIMIT 6
    `
    
    return NextResponse.json(testimonials)
  } catch (error) {
    console.error("Error fetching testimonials:", error)
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 })
  }
}
