"use server"

import { cookies } from "next/headers"
import { getUserById } from "./auth"

const SESSION_COOKIE_NAME = "session"

export async function createSession(userId: string) {
  try {
    if (!userId) {
      throw new Error("Cannot create session: userId is required")
    }
    
    console.log("Creating session for user:", userId)
    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE_NAME, userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, 
      path: "/",
    })
    
    console.log("Session created successfully")
    return true
  } catch (error) {
    console.error("Failed to create session:", error)
    throw error
  }
}

export async function getSession() {
  try {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value
    
    console.log("getSession - Session cookie:", sessionId ? 
      `Found (${sessionId.substring(0, 8)}...)` : "Not found")

    if (!sessionId) {
      console.log("getSession - No session cookie found")
      return null
    }

    const user = await getUserById(sessionId)
    
    if (!user) {
      console.log("getSession - No user found for session ID:", sessionId.substring(0, 8) + "...")
    } else {
      console.log("getSession - User found:", { id: user.id, email: user.email, role: user.role })
    }
    
    return user
  } catch (error) {
    console.error("getSession - Error retrieving session:", error)
    return null
  }
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}
