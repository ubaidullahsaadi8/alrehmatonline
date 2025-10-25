import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSession } from "@/lib/session";
import { getUserById } from "@/lib/auth";

const SESSION_COOKIE_NAME = "session";


const getHeadersObject = (req: NextRequest) => {
  const headersObject: Record<string, string> = {};
  req.headers.forEach((value, key) => {
    headersObject[key] = value;
  });
  return headersObject;
};

export async function GET(req: NextRequest) {
  try {
    console.log("Debug API - Testing session handling");
    
    
    const requestCookies = req.cookies;
    const cookiesArray = requestCookies.getAll();
    
    console.log("Debug API - Request cookies:", 
      cookiesArray.map(cookie => ({ 
        name: cookie.name, 
        value: cookie.value.substring(0, 8) + "..." 
      }))
    );
    
    const requestSessionCookie = requestCookies.get(SESSION_COOKIE_NAME);
    console.log("Debug API - Request session cookie:", requestSessionCookie ? 
      { name: requestSessionCookie.name, value: requestSessionCookie.value.substring(0, 8) + "..." } : "Not found");
    
    
    let sessionUser = null;
    let sessionError = null;
    
    try {
      sessionUser = await getSession();
      console.log("Debug API - getSession result:", sessionUser ? 
        { id: sessionUser.id, email: sessionUser.email, role: sessionUser.role } : "No user session");
    } catch (error: any) {
      sessionError = error.message || "Unknown error fetching session";
      console.error("Debug API - getSession error:", sessionError);
    }
    
    
    let directUser = null;
    if (requestSessionCookie?.value) {
      directUser = await getUserById(requestSessionCookie.value);
      console.log("Debug API - Direct user lookup:", directUser ? 
        { id: directUser.id, email: directUser.email, role: directUser.role } : "No user found");
    }
    
    
    const userIdHeader = req.headers.get("X-User-Id");
    const userRoleHeader = req.headers.get("X-User-Role");
    
    console.log("Debug API - User headers:", { 
      "X-User-Id": userIdHeader || "Not found", 
      "X-User-Role": userRoleHeader || "Not found" 
    });
    
    
    const headers = getHeadersObject(req);
    
    
    const cookiesObject: Record<string, string> = {};
    cookiesArray.forEach(cookie => {
      cookiesObject[cookie.name] = cookie.name === SESSION_COOKIE_NAME 
        ? `${cookie.value.substring(0, 8)}...` 
        : cookie.value;
    });
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      requestCookies: cookiesObject,
      headers: {
        ...headers,
        "x-user-id": userIdHeader || null,
        "x-user-role": userRoleHeader || null,
      },
      sessionData: {
        hasSessionCookie: !!requestSessionCookie,
        sessionCookieValue: requestSessionCookie ? `${requestSessionCookie.value.substring(0, 8)}...` : null,
        sessionError,
      },
      userFromSession: sessionUser ? {
        id: sessionUser.id,
        email: sessionUser.email,
        role: sessionUser.role,
        name: sessionUser.name
      } : null,
      userFromDirectLookup: directUser ? {
        id: directUser.id, 
        email: directUser.email,
        role: directUser.role,
        name: directUser.name
      } : null,
      userFromHeaders: userIdHeader ? {
        id: userIdHeader,
        role: userRoleHeader
      } : null
    });
  } catch (error: any) {
    console.error("Debug API - Error:", error);
    return NextResponse.json({ 
      error: "Error in debug endpoint",
      message: error.message || "Unknown error" 
    }, { status: 500 });
  }
}
