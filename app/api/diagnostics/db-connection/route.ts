import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(req: NextRequest) {
  console.log("DB Connection Test - Starting...")
  
  const results: {
    connectionTest: any;
    dbUrl: any;
    error: any;
  } = {
    connectionTest: null,
    dbUrl: null,
    error: null
  }
  
  try {
    
    const dbUrl = process.env.DATABASE_URL;
    
    if (!dbUrl) {
      console.log("DB Connection Test - DATABASE_URL environment variable is not set");
      return NextResponse.json({
        success: false,
        error: "DATABASE_URL environment variable is not set"
      }, { status: 500 });
    }
    
    
    results.dbUrl = {
      set: true,
      length: dbUrl.length,
      starts_with: dbUrl.substring(0, 10) + "..."
    };
    
    console.log("DB Connection Test - Testing database connection");
    
    
    const connectionTest = await sql`SELECT 1 as connection_test`;
    
    results.connectionTest = {
      success: true,
      result: connectionTest
    };
    
    console.log("DB Connection Test - Connection successful");
    
    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      diagnostics: results
    });
  } catch (error) {
    console.error("DB Connection Test - Error connecting to database:", error);
    
    results.error = {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    };
    
    return NextResponse.json({
      success: false,
      error: "Failed to connect to database",
      diagnostics: results
    }, { status: 500 });
  }
}
