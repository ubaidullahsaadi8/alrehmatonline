import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"


const userRequests: Record<string, number> = {};

export async function PUT(req: NextRequest) {
  console.log("Simple Preferences API - Starting...")
  
  try {
    
    const user = await getSession()
    console.log("Simple Preferences API - User:", user ? `Found (ID: ${user.id})` : "Not found")
    
    if (!user) {
      console.log("Simple Preferences API - No user session found")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    
    const userId = user.id;
    userRequests[userId] = (userRequests[userId] || 0) + 1;
    console.log(`Simple Preferences API - Request count for user ${userId}: ${userRequests[userId]}`)
    
    
    if (userRequests[userId] >= 10) {
      userRequests[userId] = 1;
    }
    
    
    let body;
    try {
      body = await req.json()
      console.log("Simple Preferences API - Request body:", body)
    } catch (error) {
      console.error("Simple Preferences API - Error parsing JSON:", error)
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
    }
    
    const { currency } = body
    
    if (!currency) {
      console.log("Simple Preferences API - No currency provided")
      return NextResponse.json({ error: "Currency is required" }, { status: 400 })
    }
    
    
    const validCurrencies = ['USD', 'PKR', 'SAR', 'AED', 'INR', 'EUR', 'GBP']
    if (!validCurrencies.includes(currency)) {
      console.log(`Simple Preferences API - Invalid currency: "${currency}"`)
      return NextResponse.json({ error: "Invalid currency" }, { status: 400 })
    }
    
    console.log("Simple Preferences API - Successful validation, returning mock success")
    
    const requestCount = userRequests[user.id];
    
    
    const message = requestCount === 1
      ? "Testing endpoint successful - no database changes made"
      : `Testing endpoint successful - DUPLICATE REQUEST (#${requestCount}) DETECTED`;
    
    return NextResponse.json({
      success: true,
      message,
      userId: user.id,
      currency,
      requestCount
    })
  } catch (error) {
    console.error("Simple Preferences API - Error:", error)
    return NextResponse.json(
      { 
        error: "An error occurred",
        details: error instanceof Error ? error.message : String(error)
      }, 
      { status: 500 }
    )
  }
}
