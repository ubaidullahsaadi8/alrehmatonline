import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function GET(req: NextRequest) {
  
  const user = await getSession();
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized - Not logged in" }, { status: 401 });
  }
  
  if (user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 403 });
  }

  try {
    
    const columnCheck = await sql.unsafe(`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'currency'
      ) as has_column;
    `);
    
    
    let hasColumn = false;
    if (Array.isArray(columnCheck) && 
        columnCheck.length > 0 && 
        typeof columnCheck[0] === 'object' && 
        columnCheck[0] !== null) {
      hasColumn = columnCheck[0].has_column === true;
    }
    
    if (!hasColumn) {
      
      await sql.unsafe(`
        ALTER TABLE users 
        ADD COLUMN currency VARCHAR(5) DEFAULT 'USD' NOT NULL;
      `);
      return NextResponse.json({ message: "Currency column added successfully" });
    } else {
      return NextResponse.json({ message: "Currency column already exists" });
    }
  } catch (error) {
    console.error("Error during migration:", error);
    return NextResponse.json({ error: "Migration failed" }, { status: 500 });
  }
}
