import { sql } from "@/lib/db";
import { NextResponse } from "next/server";
import * as bcrypt from "bcryptjs";
import { getUserByEmail, createUser } from "@/lib/auth";


export async function initAdminSettings() {
  try {
    
    const adminEmail = "admin@example.com";
    const existingAdmin = await getUserByEmail(adminEmail);
    
    if (!existingAdmin) {
      
      console.log("Creating default admin user");
      
      try {
        const adminUser = await createUser(
          adminEmail,
          "admin123", 
          "Admin User" 
        );
        
        
        await sql`
          UPDATE users 
          SET role = 'admin'
          WHERE email = ${adminEmail}
        `;
        
        console.log("Default admin user created with role 'admin'");
      } catch (error) {
        console.error("Error creating admin user:", error);
        return false;
      }
    } else {
      console.log("Admin user already exists, no initialization needed");
      
      // Ensure the user has admin role
      if (existingAdmin.role !== 'admin') {
        await sql`
          UPDATE users 
          SET role = 'admin'
          WHERE email = ${adminEmail}
        `;
        console.log("Updated existing user to have admin role");
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error initializing admin settings:", error);
    return false;
  }
}
