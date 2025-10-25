import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"

export async function GET(request: NextRequest) {
  try {
    console.log("Auth check API: Getting session")
    const user = await getSession()
    
    console.log("Auth check API: Session result", user ? { id: user.id, email: user.email, role: user.role } : "No session")
    
    if (!user) {
      console.log("Auth check API: No user session found")
      return NextResponse.json(
        { error: "Unauthorized" }, 
        { status: 401 }
      )
    }
    
    
    const url = new URL(request.url)
    const isAdminRequest = url.pathname.startsWith('/api/admin') || 
                          request.headers.get('X-Admin-Request') === 'true'
    
    console.log("Auth check API: Is admin request?", isAdminRequest, "User role:", user.role)
    
    if (isAdminRequest && user.role !== 'admin') {
      console.log("Auth check API: User is not admin, denying access")
      return NextResponse.json(
        { error: "Unauthorized: Admin access only" }, 
        { status: 403 }
      )
    }
    
    
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role || 'user', 
      avatar: user.avatar,
      active: user.active !== false, 
      createdAt: user.createdAt
    }
    
    console.log("Auth check API: Returning user data", userData)
    return NextResponse.json(userData)
  } catch (error) {
    console.error('Error checking authentication:', error)
    return NextResponse.json(
      { error: "Authentication failed" }, 
      { status: 500 }
    )
  }
}
