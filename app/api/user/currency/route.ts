import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"

export async function GET(req: NextRequest) {
  try {
    console.log("Currency API - Fetching user currency preference")
    
    
    const user = await getSession()
    
    if (!user) {
      console.log("Currency API - No user session found")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    console.log(`Currency API - Got user session, ID: ${user.id}`)
    
    
    const headers = {
      'Cache-Control': 'no-store, max-age=0',
      'Pragma': 'no-cache'
    }
    
    
    try {
      const result = await sql`
        SELECT currency FROM users WHERE id = ${user.id}
      `
      
      if (result.length > 0 && result[0].currency) {
        console.log(`Currency API - Found currency: ${result[0].currency}`)
        return NextResponse.json({ currency: result[0].currency }, { headers })
      } else {
        console.log("Currency API - No currency found, returning default USD")
        return NextResponse.json({ currency: "USD" }, { headers })
      }
    } catch (error) {
      console.error("Error fetching currency, column might not exist:", error)
      return NextResponse.json({ currency: "USD" }, { headers })
    }
  } catch (error) {
    console.error("Error in currency API:", error)
    return NextResponse.json(
      { error: "Failed to get currency", details: String(error) },
      { status: 500 }
    )
  }
}
