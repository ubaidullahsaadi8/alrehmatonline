import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"

export async function GET(req: NextRequest) {
  console.log("DB Diagnostics - Starting...")
  
  try {
    
    const user = await getSession()
    console.log("DB Diagnostics - User session:", user ? `Found (ID: ${user.id})` : "Not found")
    
    if (!user) {
      console.log("DB Diagnostics - No user session found")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    
    if (user.role !== "ADMIN") {
      console.log("DB Diagnostics - User is not an admin")
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }
    
    const results = {
      connectionTest: null,
      userInfo: null,
      tableInfo: null,
      columnInfo: null,
      error: null
    }
    
    
    try {
      console.log("DB Diagnostics - Testing basic connection")
      const connectionTest = await sql`SELECT 1 as connection_test`
      results.connectionTest = {
        success: true,
        result: connectionTest
      }
      console.log("DB Diagnostics - Connection test successful")
    } catch (error) {
      console.error("DB Diagnostics - Connection test failed:", error)
      results.connectionTest = {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      }
    }
    
    
    if (results.connectionTest?.success) {
      try {
        console.log("DB Diagnostics - Getting user info")
        const userInfo = await sql`
          SELECT id, name, email, role 
          FROM users 
          WHERE id = ${user.id}
        `
        results.userInfo = {
          success: true,
          result: userInfo
        }
        console.log("DB Diagnostics - User info retrieval successful")
      } catch (error) {
        console.error("DB Diagnostics - User info retrieval failed:", error)
        results.userInfo = {
          success: false,
          error: error instanceof Error ? error.message : String(error)
        }
      }
    }
    
    // Test 3: Table information
    if (results.connectionTest?.success) {
      try {
        console.log("DB Diagnostics - Getting table information")
        const tableInfo = await sql.unsafe(`
          SELECT table_name
          FROM information_schema.tables
          WHERE table_schema = 'public'
        `)
        results.tableInfo = {
          success: true,
          result: tableInfo
        }
        console.log("DB Diagnostics - Table info retrieval successful")
      } catch (error) {
        console.error("DB Diagnostics - Table info retrieval failed:", error)
        results.tableInfo = {
          success: false,
          error: error instanceof Error ? error.message : String(error)
        }
      }
    }
    
    // Test 4: Column information for users table
    if (results.connectionTest?.success) {
      try {
        console.log("DB Diagnostics - Getting column information for users table")
        const columnInfo = await sql.unsafe(`
          SELECT column_name, data_type 
          FROM information_schema.columns 
          WHERE table_name = 'users'
        `)
        results.columnInfo = {
          success: true,
          result: columnInfo
        }
        console.log("DB Diagnostics - Column info retrieval successful")
      } catch (error) {
        console.error("DB Diagnostics - Column info retrieval failed:", error)
        results.columnInfo = {
          success: false,
          error: error instanceof Error ? error.message : String(error)
        }
      }
    }
    
    return NextResponse.json({
      success: true,
      diagnostics: results
    })
  } catch (error) {
    console.error("DB Diagnostics - Uncaught error:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: "An error occurred during diagnostics",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}
