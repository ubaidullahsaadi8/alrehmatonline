import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import * as bcrypt from "bcryptjs"
import { initAdminSettings } from "@/app/actions/init-admin-settings"

export async function POST(req: NextRequest) {
  try {
    
    const result = await initAdminSettings()
    
    if (result) {
      return NextResponse.json({ success: true, message: "Admin settings initialized successfully" })
    } else {
      return NextResponse.json({ error: "Failed to initialize admin settings" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error initializing admin settings:", error)
    return NextResponse.json({ error: "Failed to initialize admin settings" }, { status: 500 })
  }
}
