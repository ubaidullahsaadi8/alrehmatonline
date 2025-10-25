import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getUserById } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  
  if (request.nextUrl.pathname === "/admin/login" || 
      request.nextUrl.pathname === "/api/debug-session") {
    console.log("Middleware: Skipping check for", request.nextUrl.pathname);
    return NextResponse.next();
  }
  
  console.log(`Middleware: Checking auth for ${request.nextUrl.pathname}`);
  
  
  const sessionId = request.cookies.get("session")?.value;
  if (!sessionId) {
    console.log("Middleware: No session cookie found");
    
    
    if (request.nextUrl.pathname.startsWith("/api/")) {
      console.log("Middleware: Returning 401 for API route - no session");
      return NextResponse.json({ error: "Unauthorized - No session" }, { status: 401 });
    }
    
    
    console.log("Middleware: Redirecting to login - no session");
    return NextResponse.redirect(new URL("/login", request.url));
  }
  
  
  const user = await getUserById(sessionId);
  
  console.log("Middleware: User from session:", user ? 
    { id: user.id, role: user.role, user_type: user.user_type, email: user.email } : "No user found for session ID");
  
  
  if (request.nextUrl.pathname.startsWith("/admin") || request.nextUrl.pathname.startsWith("/api/admin")) {
    if (!user || user.role !== "admin") {
      console.log("Middleware: User not authorized for admin access");
      
      if (request.nextUrl.pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized - Not admin" }, { status: 401 });
      }
      
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
  
  
  else if (request.nextUrl.pathname.startsWith("/teacher") || request.nextUrl.pathname.startsWith("/api/teacher")) {
    if (!user || user.user_type !== "instructor" || !user.is_approved) {
      console.log("Middleware: User not authorized for teacher access");
      
      if (request.nextUrl.pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized - Not approved instructor" }, { status: 401 });
      }
      
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
  
  
  else if (request.nextUrl.pathname.startsWith("/student") || request.nextUrl.pathname.startsWith("/api/student")) {
    if (!user || user.user_type !== "student") {
      console.log("Middleware: User not authorized for student access");
      
      if (request.nextUrl.pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized - Not student" }, { status: 401 });
      }
      
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  console.log("Middleware: User authorized, proceeding");
  
  
  const response = NextResponse.next();
  
  
  if (user) {
    response.headers.set("X-User-Id", user.id);
    response.headers.set("X-User-Role", user.role);
    response.headers.set("X-User-Type", user.user_type || "");
    response.headers.set("X-User-Email", user.email);
  }
  
  return response;
}


export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/teacher/:path*",
    "/api/teacher/:path*",
    "/student/:path*",
    "/api/student/:path*"
  ]
};