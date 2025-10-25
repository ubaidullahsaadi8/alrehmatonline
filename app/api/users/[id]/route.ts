import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    if (!params.id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const userId = params.id;
    
    
    const result = await sql`
      SELECT 
        id, 
        email, 
        name, 
        username,
        role,
        user_type,
        account_status,
        is_approved,
        active,
        country,
        education,
        currency,
        created_at,
        updated_at
      FROM users 
      WHERE id = ${userId}
      LIMIT 1
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    
    const user = result[0];
    
    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Failed to fetch user details" }, { status: 500 });
  }
}
