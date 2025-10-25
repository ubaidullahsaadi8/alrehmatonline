import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"


export async function GET(req: NextRequest) {
  try {
    const user = await getSession()
    
    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    
    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      }
    })
  } catch (error) {
    console.error("Error getting current user:", error)
    return NextResponse.json(
      { error: "Failed to get user" },
      { status: 500 }
    )
  }
}
