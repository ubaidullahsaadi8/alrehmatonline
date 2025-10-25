import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"

export async function PUT(req: NextRequest) {
  console.log("Simple Currency Update - Starting...")
  
  try {
    
    const user = await getSession()
    if (!user) {
      console.log("Simple Currency Update - User not authenticated")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    console.log(`Simple Currency Update - User: ${user.id}`)
    
    
    const body = await req.json()
    const { currency } = body
    
    console.log(`Simple Currency Update - Received currency: ${currency}`)
    
    if (!currency) {
      console.log("Simple Currency Update - No currency provided")
      return NextResponse.json({ error: "Currency is required" }, { status: 400 })
    }
    
    
    const validCurrencies = ['USD', 'PKR', 'SAR', 'AED', 'INR', 'EUR', 'GBP']
    if (!validCurrencies.includes(currency)) {
      console.log(`Simple Currency Update - Invalid currency: ${currency}`)
      return NextResponse.json({ error: "Invalid currency" }, { status: 400 })
    }
    
    try {
      console.log(`Simple Currency Update - Updating currency to ${currency} for user ${user.id}`)
      
      
      await sql`
        UPDATE users
        SET currency = ${currency}
        WHERE id = ${user.id}
      `
      
      console.log("Simple Currency Update - Update successful")
      return NextResponse.json({
        success: true,
        message: "Currency updated successfully",
        currency
      })
    } catch (error) {
      console.error("Simple Currency Update - Database error:", error)
      return NextResponse.json({
        success: false,
        error: "Database error",
        details: error instanceof Error ? error.message : String(error)
      }, { status: 500 })
    }
  } catch (error) {
    console.error("Simple Currency Update - Error:", error)
    return NextResponse.json({
      success: false,
      error: "An error occurred",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
