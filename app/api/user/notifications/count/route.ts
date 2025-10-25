import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"


export async function GET(req: NextRequest) {
  try {
    
    const user = await getSession()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Count admin notifications
    const adminResult = await sql`
      SELECT COUNT(*) as count
      FROM notifications
      WHERE user_id = ${user.id} AND read = false
    `
    
    let adminCount = parseInt(adminResult[0]?.count || 0)

    // Count course notifications (if user is student)
    let courseCount = 0
    if (user.user_type === 'student' || user.role === 'student') {
      // Get enrolled courses
      const enrolledCourses = await sql`
        SELECT course_id FROM student_courses
        WHERE student_id = ${user.id}
      `

      const courseIds = enrolledCourses.map((c: any) => c.course_id)

      if (courseIds.length > 0) {
        // Count unread course notifications
        const courseResult = await sql`
          SELECT COUNT(*) as count
          FROM course_notifications cn
          LEFT JOIN notification_reads nr ON cn.id = nr.notification_id AND nr.student_id = ${user.id}
          WHERE cn.course_id = ANY(${courseIds}) AND nr.id IS NULL
        `
        
        courseCount = parseInt(courseResult[0]?.count || 0)
      }
    }

    const totalCount = adminCount + courseCount
    
    return NextResponse.json({ count: totalCount })
  } catch (error) {
    console.error("Error fetching notification count:", error)
    return NextResponse.json(
      { error: "Failed to fetch notification count" },
      { status: 500 }
    )
  }
}
