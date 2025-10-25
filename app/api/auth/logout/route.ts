import { NextRequest, NextResponse } from "next/server"
import { deleteSession } from "@/lib/session"


export async function POST(req: NextRequest) {
  try {
    await deleteSession()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error logging out:", error)
    return NextResponse.json(
      { error: "Failed to log out" },
      { status: 500 }
    )
  }
}
