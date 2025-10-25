import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"

export async function GET(request: Request) {
  try {
    
    const session = await getSession()
    if (!session || session.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    
    
    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role') || 'student'
    
    console.log(`Checking if users table has role column and getting users with role: ${role}`)
    
    
    const checkColumn = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'role'
      ) as exists
    `
    
    const roleColumnExists = checkColumn[0]?.exists || false
    
    if (!roleColumnExists) {
      return NextResponse.json({ 
        error: "Role column does not exist in users table",
        roleColumnExists
      }, { status: 200 })
    }
    
    // If role column exists, get users with that role
    const result = await sql`
      SELECT 
        id, 
        name, 
        email, 
        role, 
        active,
        account_status,
        is_approved,
        created_at
      FROM users 
      WHERE role = ${role}
      ORDER BY created_at DESC
    `
    
    return NextResponse.json({ 
      roleColumnExists,
      users: result,
      count: result.length
    }, { status: 200 })
    
  } catch (error) {
    console.error("Error checking users with role:", error)
    return NextResponse.json({ error: "Failed to check users" }, { status: 500 })
  }
}
