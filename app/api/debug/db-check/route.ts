import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"


export async function GET(req: NextRequest) {
  try {
    
    const user = await getSession()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    
    const coursesCount = await sql`
      SELECT COUNT(*) as count FROM courses
    `
    
    // Count services
    const servicesCount = await sql`
      SELECT COUNT(*) as count FROM services
    `
    
    // Get a sample of courses if they exist
    let sampleCourses: any[] = [];
    if (coursesCount[0] && coursesCount[0].count > 0) {
      sampleCourses = await sql`
        SELECT id, title, price FROM courses LIMIT 5
      `
    }
    
    // Get a sample of services if they exist
    let sampleServices: any[] = [];
    if (servicesCount[0] && servicesCount[0].count > 0) {
      sampleServices = await sql`
        SELECT id, title, price FROM services LIMIT 5
      `
    }

    return NextResponse.json({
      database: {
        connection: "OK"
      },
      counts: {
        courses: coursesCount[0]?.count || 0,
        services: servicesCount[0]?.count || 0
      },
      samples: {
        courses: sampleCourses,
        services: sampleServices
      },
      session: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        }
      }
    })
  } catch (error) {
    console.error("Error checking database:", error)
    return NextResponse.json(
      { error: "Database check failed", details: String(error) },
      { status: 500 }
    )
  }
}
