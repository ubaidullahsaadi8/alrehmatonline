import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getUserById } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  
  if (request.nextUrl.pathname === "/student/login" || 
      request.nextUrl.pathname === "/api/debug-session") {
    console.log("Student Middleware: Skipping check for", request.nextUrl.pathname);
    return NextResponse.next();
  }
  
  console.log(`Student Middleware: Checking auth for ${request.nextUrl.pathname}`);
  
  
  const sessionId = request.cookies.get("session")?.value;
  if (!sessionId) {
    console.log("Student Middleware: No session cookie found");
    
    
    if (request.nextUrl.pathname.startsWith("/api/student")) {
      console.log("Student Middleware: Returning 401 for API route - no session");
      return NextResponse.json({ error: "Unauthorized - No session" }, { status: 401 });
    }
    
    
    console.log("Student Middleware: Redirecting to login - no session");
    return NextResponse.redirect(new URL("/login", request.url));
  }
  
  
  const user = await getUserById(sessionId);
  
  console.log("Student Middleware: User from session:", user ? 
    { id: user.id, role: user.role, user_type: user.user_type, email: user.email } : "No user found for session ID");
  
  
  if (!user || user.user_type !== "student") {
    console.log("Student Middleware: User not authorized for student access");
    
    
    if (request.nextUrl.pathname.startsWith("/api/student")) {
      console.log("Student Middleware: Returning 401 for API route - not student");
      return NextResponse.json({ error: "Unauthorized - Not student" }, { status: 401 });
    }
    
    
    console.log("Student Middleware: Redirecting to login - not student");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  console.log("Student Middleware: User authorized, proceeding");
  
  
  const response = NextResponse.next();
  
  
  response.headers.set("X-User-Id", user.id);
  response.headers.set("X-User-Role", user.role);
  response.headers.set("X-User-Type", user.user_type);
  response.headers.set("X-User-Email", user.email);
  
  return response;
}


export const config = {
  matcher: [
    "/student/:path*",
    "/api/student/:path*"
  ]
};