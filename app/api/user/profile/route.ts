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
        SELECT 
          id, 
          name, 
          email, 
          avatar, 
          phone, 
          whatsapp, 
          telegram, 
          secondary_email, 
          address,
          currency,
          created_at as "createdAt"
        FROM users
        WHERE id = ${user.id}
      `;
    } else {
      result = await sql`
        SELECT 
          id, 
          name, 
          email, 
          avatar, 
          phone, 
          whatsapp, 
          telegram, 
          secondary_email, 
          address,
          created_at as "createdAt"
        FROM users
        WHERE id = ${user.id}
      `;
    }
    
    if (!result || result.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Return profile with currency (default to USD if not present)
    const profile = result[0];
    if (!hasCurrencyColumn) {
      profile.currency = 'USD';
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 }
    )
  }
}

// Update user profile
export async function PUT(req: NextRequest) {
  try {
    // Check for authentication
    const user = await getSession()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get profile data from request
    const { 
      name, 
      phone, 
      whatsapp, 
      telegram, 
      secondary_email, 
      address 
    } = await req.json()

    // Update user profile
    await sql`
      UPDATE users
      SET 
        name = COALESCE(${name}, name),
        phone = ${phone},
        whatsapp = ${whatsapp},
        telegram = ${telegram},
        secondary_email = ${secondary_email},
        address = ${address},
        updated_at = NOW()
      WHERE id = ${user.id}
    `

    // Check if currency column exists for the response
    let hasCurrencyColumn = false;
    try {
      const columnCheck = await sql.unsafe(`
        SELECT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_name = 'users' AND column_name = 'currency'
        ) as has_column;
      `);
      // Handle the typing safely
      if (Array.isArray(columnCheck) && 
          columnCheck.length > 0 && 
          typeof columnCheck[0] === 'object' && 
          columnCheck[0] !== null) {
        hasCurrencyColumn = columnCheck[0].has_column === true;
      }
    } catch (error) {
      console.error("Error checking for currency column:", error);
    }

    // Get updated profile based on whether currency column exists
    let result;
    if (hasCurrencyColumn) {
      result = await sql`
        SELECT 
          id, 
          name, 
          email, 
          avatar, 
          phone, 
          whatsapp, 
          telegram, 
          secondary_email, 
          address,
          currency,
          created_at as "createdAt"
        FROM users
        WHERE id = ${user.id}
      `;
    } else {
      result = await sql`
        SELECT 
          id, 
          name, 
          email, 
          avatar, 
          phone, 
          whatsapp, 
          telegram, 
          secondary_email, 
          address,
          created_at as "createdAt"
        FROM users
        WHERE id = ${user.id}
      `;
    }

    
    const profile = result[0];
    if (!hasCurrencyColumn) {
      profile.currency = 'USD';
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error("Error updating user profile:", error)
    return NextResponse.json(
      { error: "Failed to update user profile" },
      { status: 500 }
    )
  }
}
