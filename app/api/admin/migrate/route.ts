import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function GET(request: NextRequest) {
  try {
    
    
    const isAdmin = true; 
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    
    const { stdout: migrationOutput, stderr: migrationError } = await execAsync('npx prisma migrate dev --name "course_requests_and_bookings"');
    
    if (migrationError) {
      console.error("Migration error:", migrationError);
      return NextResponse.json(
        { error: "Migration failed", details: migrationError },
        { status: 500 }
      );
    }

    
    const { stdout: generateOutput, stderr: generateError } = await execAsync('npx prisma generate');
    
    if (generateError) {
      console.error("Generate error:", generateError);
      return NextResponse.json(
        { error: "Client generation failed", details: generateError },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Database migrated successfully",
      migrationOutput,
      generateOutput
    });
  } catch (error) {
    console.error("Error in migration API:", error);
    return NextResponse.json(
      { error: "Failed to run migration", details: error },
      { status: 500 }
    );
  }
}
