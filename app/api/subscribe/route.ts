import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { v4 as uuidv4 } from 'uuid';
import { sql } from "@/lib/db"; 


const emailSchema = z.object({
  type: z.literal("gmail"),
  value: z.string().email("Invalid email address"),
});

const phoneSchema = z.object({
  type: z.enum(["whatsapp", "imo", "telegram"]),
  value: z.string().min(6, "Phone number is too short"),
  country_code: z.string().min(1, "Country code is required"),
});

const subscribeSchema = z.discriminatedUnion("type", [
  emailSchema,
  phoneSchema,
]);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    
    const validationResult = subscribeSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validationResult.error.errors },
        { status: 400 }
      );
    }
    
    const data = validationResult.data;
    
    
    let valueToStore = data.value;
    if (data.type !== "gmail") {
      valueToStore = `${data.country_code}${data.value.replace(/\D/g, '')}`;
    }
    
    try {
      
      const checkExisting = await sql`
        SELECT * FROM subscribers WHERE value = ${valueToStore} LIMIT 1
      `;

      if (checkExisting && checkExisting.length > 0) {
        const existing = checkExisting[0];
        
        // If subscriber exists and is active
        if (existing.active) {
          return NextResponse.json(
            { message: "You're already subscribed" },
            { status: 200 }
          );
        }
        
        // If subscriber exists but is inactive, reactivate
        await sql`
          UPDATE subscribers 
          SET active = true 
          WHERE id = ${existing.id}
        `;
        
        return NextResponse.json(
          { message: "Your subscription has been reactivated!" },
          { status: 200 }
        );
      }
      
      // Create new subscriber using direct SQL
      const id = uuidv4();
      const now = new Date();
      
      await sql`
        INSERT INTO subscribers (id, value, type, country_code, created_at, active)
        VALUES (
          ${id}, 
          ${valueToStore}, 
          ${data.type}, 
          ${data.type !== "gmail" ? data.country_code : null}, 
          ${now}, 
          true
        )
      `;
      
      return NextResponse.json(
        { message: "Subscribed successfully!" },
        { status: 201 }
      );
    } catch (dbError) {
      console.error("Database error:", dbError);
      
      
      return NextResponse.json(
        { message: "Subscription request received" },
        { status: 200 }
      );
    }

  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json(
      { error: "Failed to subscribe" },
      { status: 500 }
    );
  }
}
