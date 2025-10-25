import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"


export async function GET(req: NextRequest) {
  try {
    
    const user = await getSession()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    
    let hasCurrencyColumn = false;
    try {
      const columnCheck = await sql.unsafe(`
        SELECT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_name = 'users' AND column_name = 'currency'
        ) as has_column;
      `);
      
      if (Array.isArray(columnCheck) && 
          columnCheck.length > 0 && 
          typeof columnCheck[0] === 'object' && 
          columnCheck[0] !== null) {
        hasCurrencyColumn = columnCheck[0].has_column === true;
      }
    } catch (error) {
      console.error("Error checking for currency column:", error);
    }

    
    let result;
    if (hasCurrencyColumn) {
      result = await sql`
        SELECT id, currency
        FROM users
        WHERE id = ${user.id}
      `;
    } else {
      // If currency column doesn't exist yet, return default USD
      result = await sql`
        SELECT id
        FROM users
        WHERE id = ${user.id}
      `;
    }
    
    if (!result || result.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      currency: (hasCurrencyColumn ? result[0].currency : null) || 'USD'
    })
  } catch (error) {
    console.error("Error fetching user preferences:", error)
    return NextResponse.json(
      { error: "Failed to fetch user preferences" },
      { status: 500 }
    )
  }
}

// Update user preferences
export async function PUT(req: NextRequest) {
  try {
    console.log("Preferences API - PUT: Starting...")
    
    // Check for authentication
    const user = await getSession()
    console.log("Preferences API - User session:", user ? `Found (ID: ${user.id})` : "Not found")
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get preferences data from request
    let body;
    try {
      body = await req.json()
      console.log("Preferences API - Request body:", body)
    } catch (error) {
      console.error("Preferences API - Error parsing JSON:", error)
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 })
    }

    const { currency } = body

    // Validate currency
    const validCurrencies = ['USD', 'PKR', 'SAR', 'AED', 'INR', 'EUR', 'GBP']
    console.log(`Preferences API - Currency value: "${currency}"`)
    if (currency && !validCurrencies.includes(currency)) {
      console.log(`Preferences API - Invalid currency: "${currency}"`)
      return NextResponse.json(
        { error: `Invalid currency: "${currency}"` },
        { status: 400 }
      )
    }

    // Check if currency column exists
    console.log("Preferences API - Checking if currency column exists...")
    let hasCurrencyColumn = false;
    try {
      const columnCheck = await sql.unsafe(`
        SELECT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_name = 'users' AND column_name = 'currency'
        ) as has_column;
      `);
      console.log("Preferences API - Column check result:", JSON.stringify(columnCheck))
      
      // Handle the typing safely
      if (Array.isArray(columnCheck) && 
          columnCheck.length > 0 && 
          typeof columnCheck[0] === 'object' && 
          columnCheck[0] !== null) {
        hasCurrencyColumn = columnCheck[0].has_column === true;
        console.log(`Preferences API - Currency column exists: ${hasCurrencyColumn}`)
      } else {
        console.log("Preferences API - Unexpected column check response format")
      }
    } catch (error) {
      console.error("Preferences API - Error checking for currency column:", error);
    }

    // If column doesn't exist, run the migration first
    if (!hasCurrencyColumn) {
      console.log("Preferences API - Currency column doesn't exist, attempting to add it...")
      try {
        const alterResult = await sql.unsafe(`
          ALTER TABLE users 
          ADD COLUMN currency VARCHAR(5) DEFAULT 'USD' NOT NULL;
        `);
        console.log('Preferences API - Currency column added successfully!', alterResult);
        hasCurrencyColumn = true;
      } catch (error) {
        console.error('Preferences API - Error adding currency column:', error);
        return NextResponse.json(
          { 
            error: "Failed to update database schema. Please contact an administrator.",
            details: error instanceof Error ? error.message : String(error)
          },
          { status: 500 }
        );
      }
    }

    // Now update user preferences
    console.log(`Preferences API - Updating user preferences, hasCurrencyColumn=${hasCurrencyColumn}`)
    if (hasCurrencyColumn) {
      try {
        await sql`
          UPDATE users
          SET currency = ${currency}, updated_at = NOW()
          WHERE id = ${user.id}
        `;
        console.log("Preferences API - User preferences updated successfully")
      } catch (error) {
        console.error("Preferences API - Error updating user preferences:", error)
        return NextResponse.json(
          { 
            error: "Failed to update user preferences",
            details: error instanceof Error ? error.message : String(error)
          },
          { status: 500 }
        );
      }
    }

    console.log("Preferences API - Sending success response")
    return NextResponse.json({
      success: true,
      message: "Preferences updated successfully",
      currency
    })
  } catch (error) {
    console.error("Preferences API - Uncaught error:", error)
    return NextResponse.json(
      { 
        error: "Failed to update user preferences",
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
