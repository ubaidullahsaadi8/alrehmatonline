import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const service = await sql`
      SELECT * FROM services WHERE id = ${id} LIMIT 1
    `

    if (service.length === 0) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    return NextResponse.json(service[0])
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch service" }, { status: 500 })
  }
}
