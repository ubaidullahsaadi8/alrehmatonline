import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const user = await getSession();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 401 });
    }

    // Add currency column if it doesn't exist
    await sql`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD'
    `;

    return NextResponse.json({
      success: true,
      message: "Currency column added to users table successfully"
    });
  } catch (error) {
    console.error("Error during migration:", error);
    return NextResponse.json(
      { error: "Failed to execute migration", details: String(error) },
      { status: 500 }
    );
  }
}
