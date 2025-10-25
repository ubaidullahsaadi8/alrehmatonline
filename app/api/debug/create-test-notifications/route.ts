import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    
    const user = await getSession();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    
    const notifications = [
      {
        title: "Welcome to Our Platform",
        message: "Thank you for joining! We're excited to have you here.",
        type: "success"
      },
      {
        title: "Complete Your Profile",
        message: "Add your profile picture and personal details to get the most out of your account.",
        type: "info"
      },
      {
        title: "New Feature Available",
        message: "We've just released a new feature you might be interested in.",
        type: "info"
      }
    ];
    
    const results = [];
    
    
    for (const notification of notifications) {
      const id = crypto.randomUUID();
      
      const result = await sql`
        INSERT INTO notifications (
          id, 
          user_id, 
          title, 
          message, 
          type, 
          read, 
          created_at, 
          created_by,
          link
        )
        VALUES (
          ${id},
          ${user.id},
          ${notification.title},
          ${notification.message},
          ${notification.type},
          false,
          CURRENT_TIMESTAMP,
          ${user.id},
          ${notification.type === 'info' ? '/dashboard' : null}
        )
        RETURNING id, title, type
      `;
      
      results.push(result[0]);
    }
    
    return NextResponse.json({ 
      message: "Test notifications created successfully",
      notifications: results
    });
  } catch (error) {
    console.error("Error creating test notifications:", error);
    return NextResponse.json(
      { error: "Failed to create test notifications", details: String(error) },
      { status: 500 }
    );
  }
}
