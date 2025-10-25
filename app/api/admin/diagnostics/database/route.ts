import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"


export async function GET(req: NextRequest) {
  try {
    
    const session = await getSession()
    
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    
    let currencyColumnExists = false
    
    try {
      const columnCheck = await sql`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'currency'
      `
      
      currencyColumnExists = columnCheck.length > 0
      
      // If currency column doesn't exist, add it
      if (!currencyColumnExists) {
        await sql`
          ALTER TABLE users 
          ADD COLUMN currency VARCHAR(10) DEFAULT 'USD'
        `
        
        currencyColumnExists = true
      }
    } catch (error) {
      console.error("Error checking/adding currency column:", error)
    }
    
    // Get all columns in users table
    const usersColumns = await sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position
    `
    
    return NextResponse.json({
      currencyColumnExists,
      usersColumns
    })
  } catch (error) {
    console.error("Error in database diagnostics:", error)
    return NextResponse.json({ 
      error: "Failed to run database diagnostics", 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
