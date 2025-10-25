import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"


export async function GET(req: NextRequest) {
  try {
    console.log("Fetching instructors from API")
    
    
    const user = await getSession()
    console.log("User session:", user ? { id: user.id, role: user.role } : "No session")
    
    if (!user || user.role !== "admin") {
      console.log("Unauthorized access attempt to instructors API")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    
    const classesTableExists = await sql`
      SELECT EXISTS (
        SELECT FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'classes'
      );
    `;
    
    let instructors;
    
    if (classesTableExists[0].exists) {
      // If classes table exists, get instructors with course count
      instructors = await sql`
        SELECT 
          u.id,
          u.name,
          u.email,
          u.country,
          u.education,
          u.is_approved,
          u.active,
          u.account_status,
          u.avatar,
          u.created_at,
          COUNT(c.id) AS courses_count
        FROM users u
        LEFT JOIN classes c ON c.instructor_id = u.id
        WHERE u.user_type = 'instructor'
        GROUP BY u.id, u.name, u.email, u.country, u.education, u.is_approved, 
                 u.active, u.account_status, u.avatar, u.created_at
        ORDER BY u.created_at DESC
      `;
    } else {
      // If classes table doesn't exist, get instructors without course count
      instructors = await sql`
        SELECT 
          id,
          name,
          email,
          country,
          education,
          is_approved,
          active,
          account_status,
          avatar,
          created_at,
          0 AS courses_count
        FROM users
        WHERE user_type = 'instructor'
        ORDER BY created_at DESC
      `;
    }
    
    console.log(`Fetched ${instructors ? instructors.length : 0} instructors`)
    
    return NextResponse.json(instructors)

  } catch (error) {
    console.error("Error fetching instructors:", error)
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch instructors" }),
      { status: 500 }
    )
  }
}
