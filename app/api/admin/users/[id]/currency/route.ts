import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const userId = params.id
    
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const body = await req.json()
    const { currency } = body

    if (!currency) {
      return NextResponse.json({ error: "Currency is required" }, { status: 400 })
    }

    
    const validCurrencies = ['USD', 'PKR', 'SAR', 'AED', 'INR', 'EUR', 'GBP']
    if (!validCurrencies.includes(currency)) {
      return NextResponse.json({ error: "Invalid currency" }, { status: 400 })
    }

    
    try {
      
      await sql`SELECT currency FROM users LIMIT 1`;
    } catch (error) {
      
      console.log("Adding currency column to users table");
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD'`;
    }

    // Update the user's currency preference
    await sql`
      UPDATE users 
      SET currency = ${currency}
      WHERE id = ${userId}
    `;

    // Return the updated user data
    const updatedUser = await sql`
      SELECT id, currency 
      FROM users 
      WHERE id = ${userId}
    `;

    if (updatedUser.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ 
      message: "Currency updated successfully", 
      user: updatedUser[0] 
    })
  } catch (error) {
    console.error("Error updating user currency:", error)
    return NextResponse.json(
      { 
        error: "Failed to update user currency", 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    )
  }
}
