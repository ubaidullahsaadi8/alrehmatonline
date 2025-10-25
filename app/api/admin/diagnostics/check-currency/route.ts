import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"


export async function GET(req: NextRequest) {
  try {
    
    const user = await getSession()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    
    const userData = await sql`
      SELECT id, name, email, currency
      FROM users
      WHERE id = ${user.id}
    `
    
    if (!userData.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    
    return NextResponse.json({
      message: "Currency info retrieved successfully",
      user: {
        id: userData[0].id,
        name: userData[0].name,
        email: userData[0].email,
        currency: userData[0].currency || "USD" 
      }
    })
  } catch (error) {
    console.error("Error checking currency:", error)
    return NextResponse.json({ 
      error: "Failed to check currency", 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
