import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"

export async function GET(req: NextRequest) {
  console.log("Working Preferences API - GET Starting...")
  
  try {
    
    const user = await getSession()
    console.log("Working Preferences API - User:", user ? `Found (ID: ${user.id})` : "Not found")
    
    if (!user) {
      console.log("Working Preferences API - No user session found")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    
    let hasCurrencyColumn = false;
    let result;

    try {
      console.log("Working Preferences API - Checking if currency column exists...")
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
        console.log(`Working Preferences API - Currency column exists: ${hasCurrencyColumn}`)
      }
    } catch (error) {
      console.error("Working Preferences API - Error checking for currency column:", error);
    }

    
    if (hasCurrencyColumn) {
      console.log("Working Preferences API - Getting user currency preference...")
      result = await sql`
        SELECT currency
        FROM users
        WHERE id = ${user.id}
      `;
      console.log("Working Preferences API - User currency result:", result)
    } else {
      console.log("Working Preferences API - Currency column doesn't exist, returning default USD")
    }
    
    // Return the currency (or default to USD if not found)
    const currency = (hasCurrencyColumn && result && result.length > 0) 
      ? result[0].currency 
      : 'USD';
      
    console.log(`Working Preferences API - Returning currency: ${currency}`)

    return NextResponse.json({
      success: true,
      currency
    })
  } catch (error) {
    console.error("Working Preferences API - Error fetching user preferences:", error)
    return NextResponse.json(
      { error: "Failed to fetch user preferences" },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  console.log("Working Preferences API - PUT Starting...")
  
  try {
    // Check for authentication
    const user = await getSession()
    console.log("Working Preferences API - User:", user ? `Found (ID: ${user.id})` : "Not found")
    
    if (!user) {
      console.log("Working Preferences API - No user session found")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    // Parse request body
    let body;
    try {
      body = await req.json()
      console.log("Working Preferences API - Request body:", body)
    } catch (error) {
      console.error("Working Preferences API - Error parsing JSON:", error)
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
    }
    
    const { currency } = body
    
    if (!currency) {
      console.log("Working Preferences API - No currency provided")
      return NextResponse.json({ error: "Currency is required" }, { status: 400 })
    }
    
    // Validate currency
    const validCurrencies = ['USD', 'PKR', 'SAR', 'AED', 'INR', 'EUR', 'GBP']
    if (!validCurrencies.includes(currency)) {
      console.log(`Working Preferences API - Invalid currency: "${currency}"`)
      return NextResponse.json({ error: "Invalid currency" }, { status: 400 })
    }
    
    // Check if currency column exists and create it if needed
    let hasCurrencyColumn = false;
    try {
      console.log("Working Preferences API - Checking if currency column exists...")
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
        console.log(`Working Preferences API - Currency column exists: ${hasCurrencyColumn}`)
      }
      
      // Add column if needed
      if (!hasCurrencyColumn) {
        console.log("Working Preferences API - Currency column doesn't exist, adding it now...")
        try {
          await sql.unsafe(`
            ALTER TABLE users 
            ADD COLUMN currency VARCHAR(5) DEFAULT 'USD' NOT NULL;
          `);
          console.log("Working Preferences API - Currency column added successfully!")
          hasCurrencyColumn = true;
        } catch (error) {
          console.error("Working Preferences API - Error adding currency column:", error);
          return NextResponse.json(
            { error: "Failed to update database schema" },
            { status: 500 }
          );
        }
      }
      
      // Now update the user's currency preference
      console.log(`Working Preferences API - Updating user's currency to ${currency}...`)
      await sql`
        UPDATE users
        SET currency = ${currency}, updated_at = NOW()
        WHERE id = ${user.id}
      `;
      console.log("Working Preferences API - Currency updated successfully!")
      
      return NextResponse.json({
        success: true,
        message: "Currency preference updated successfully",
        currency
      });
    } catch (error) {
      console.error("Working Preferences API - Error updating currency:", error);
      return NextResponse.json(
        { error: "Failed to update currency preference" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Working Preferences API - Uncaught error:", error)
    return NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    )
  }
}
