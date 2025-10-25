import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const user = await getSession();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { type } = await req.json();
    
    let result: any = {};

    // Seed sample courses
    if (!type || type === "courses") {
      const courseId = crypto.randomUUID();
      await sql`
        INSERT INTO courses (id, title, description, image, price, duration, level, instructor, category, featured)
        VALUES (
          ${courseId},
          'Sample Course',
          'This is a sample course for testing',
          '/placeholder.jpg',
          99.99,
          '8 weeks',
          'Beginner',
          'Sample Instructor',
          'Programming',
          false
        )
        ON CONFLICT (id) DO NOTHING
      `;
      result.courses = { success: true, message: "Sample course created" };
    }

    // Seed sample services
    if (!type || type === "services") {
      const serviceId = crypto.randomUUID();
      await sql`
        INSERT INTO services (id, title, description, image, features, price, featured)
        VALUES (
          ${serviceId},
          'Sample Service',
          'This is a sample service for testing',
          '/placeholder.jpg',
          ARRAY['Feature 1', 'Feature 2', 'Feature 3'],
          '49.99',
          false
        )
        ON CONFLICT (id) DO NOTHING
      `;
      result.services = { success: true, message: "Sample service created" };
    }

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      result
    });
  } catch (error) {
    console.error("Error during database seeding:", error);
    return NextResponse.json(
      { error: "Failed to seed database", details: String(error) },
      { status: 500 }
    );
  }
}
