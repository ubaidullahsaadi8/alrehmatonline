import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"

export async function GET(req: NextRequest) {
  try {
    
    const user = await getSession()
    
    console.log("Dashboard API - User session:", user)
    
    if (!user) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 })
    }
    
    if (user.role !== "admin") {
      console.log("Dashboard API - User is not admin:", user.role)
      return NextResponse.json({ error: "Unauthorized - admin role required" }, { status: 403 })
    }

    
    const totalUsers = await sql`SELECT COUNT(*) as count FROM users`
    const totalMessages = await sql`SELECT COUNT(*) as count FROM contact_messages`
    const totalServices = await sql`SELECT COUNT(*) as count FROM services`
    const totalCourses = await sql`SELECT COUNT(*) as count FROM courses`
    const totalTestimonials = await sql`SELECT COUNT(*) as count FROM testimonials`

    
    
    const activeUsers = await sql`SELECT COUNT(*) as count FROM users`
    
    
    const featuredServices = await sql`SELECT COUNT(*) as count FROM services WHERE COALESCE(featured, false) = true`
    const featuredCourses = await sql`SELECT COUNT(*) as count FROM courses WHERE COALESCE(featured, false) = true`
    const featuredTestimonials = await sql`SELECT COUNT(*) as count FROM testimonials WHERE COALESCE(featured, false) = true`
    
    
    const recentMessages = await sql`
      SELECT COUNT(*) as count FROM contact_messages 
      WHERE created_at > NOW() - INTERVAL '7 days'
    `

    // Get unread messages count - contact_messages doesn't have a read column in the init script
    // so we'll count recent messages as unread for now
    const unreadMessages = await sql`
      SELECT COUNT(*) as count FROM contact_messages 
      WHERE created_at > NOW() - INTERVAL '3 days'
    `

    
    console.log("Dashboard API - Query results:", {
      totalUsers,
      totalMessages,
      totalServices,
      totalCourses,
      totalTestimonials
    })
    
    const responseData = {
      totalUsers: parseInt(totalUsers[0]?.count || 0),
      totalMessages: parseInt(totalMessages[0]?.count || 0),
      totalServices: parseInt(totalServices[0]?.count || 0),
      totalCourses: parseInt(totalCourses[0]?.count || 0),
      totalTestimonials: parseInt(totalTestimonials[0]?.count || 0),
      activeUsers: parseInt(activeUsers[0]?.count || 0),
      featuredServices: parseInt(featuredServices[0]?.count || 0),
      featuredCourses: parseInt(featuredCourses[0]?.count || 0),
      featuredTestimonials: parseInt(featuredTestimonials[0]?.count || 0),
      recentMessages: parseInt(recentMessages[0]?.count || 0),
      unreadMessages: parseInt(unreadMessages[0]?.count || 0)
    }
    
    console.log("Dashboard API - Response data:", responseData)
    
    return NextResponse.json(responseData)
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    )
  }
}
