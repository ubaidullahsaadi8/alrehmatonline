import { getUserByUsername } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 });
  }

  try {
    const user = await getUserByUsername(username);
    return NextResponse.json({ available: !user });
  } catch (error) {
    console.error("Error checking username:", error);
    return NextResponse.json({ error: "Failed to check username" }, { status: 500 });
  }
}
