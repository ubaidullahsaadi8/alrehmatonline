import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"

export async function GET(req: NextRequest) {
  console.log("Simple GET Preferences - Starting...")
  
  try {
    
    const user = await getSession()
    console.log("Simple GET Preferences - User:", user ? `Found (ID: ${user.id})` : "Not found")
    
    if (!user) {
      console.log("Simple GET Preferences - No user session found")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    console.log("Simple GET Preferences - Returning mock currency data")
    
    return NextResponse.json({
      success: true,
      userId: user.id,
      currency: "USD"
    })
  } catch (error) {
    console.error("Simple GET Preferences - Error:", error)
    return NextResponse.json(
      { 
        error: "An error occurred",
        details: error instanceof Error ? error.message : String(error)
      }, 
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  console.log("Simple PUT Preferences - Starting...")
  
  try {
    
    const user = await getSession()
    console.log("Simple PUT Preferences - User:", user ? `Found (ID: ${user.id})` : "Not found")
    
    if (!user) {
      console.log("Simple PUT Preferences - No user session found")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    
    let body;
    try {
      body = await req.json()
      console.log("Simple PUT Preferences - Request body:", body)
    } catch (error) {
      console.error("Simple PUT Preferences - Error parsing JSON:", error)
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
    }
    
    const { currency } = body
    
    if (!currency) {
      console.log("Simple PUT Preferences - No currency provided")
      return NextResponse.json({ error: "Currency is required" }, { status: 400 })
    }
    
    
    const validCurrencies = ['USD', 'PKR', 'SAR', 'AED', 'INR', 'EUR', 'GBP']
    if (!validCurrencies.includes(currency)) {
      console.log(`Simple PUT Preferences - Invalid currency: "${currency}"`)
      return NextResponse.json({ error: "Invalid currency" }, { status: 400 })
    }
    
    
    try {
      console.log("Simple PUT Preferences - Testing database connection")
      const testResult = await sql`SELECT 1 as test`
      console.log("Simple PUT Preferences - Database connection successful:", testResult)
    } catch (dbError) {
      console.error("Simple PUT Preferences - Database connection error:", dbError)
      return NextResponse.json(
        { 
          error: "Database connection error", 
          details: dbError instanceof Error ? dbError.message : String(dbError)
        }, 
        { status: 500 }
      )
    }
    
    console.log("Simple PUT Preferences - Returning success response")
    return NextResponse.json({
      success: true,
      message: "Currency preference received successfully",
      userId: user.id,
      currency
    })
  } catch (error) {
    console.error("Simple PUT Preferences - Error:", error)
    return NextResponse.json(
      { 
        error: "An error occurred",
        details: error instanceof Error ? error.message : String(error)
      }, 
      { status: 500 }
    )
  }
}
