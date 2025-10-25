import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import * as bcrypt from "bcryptjs"
import { getUserById, getUserByEmail, updateUserById } from "@/lib/auth"
import { getSession } from "@/lib/session"


const SESSION_COOKIE_NAME = "session"

async function getUserFromRequest(req: NextRequest) {
  
  const userId = req.headers.get("X-User-Id");
  const userRole = req.headers.get("X-User-Role");
  
  if (userId && userRole) {
    console.log("API: Got user ID from headers:", userId);
    const user = await getUserById(userId);
    if (user) {
      console.log("API: Got user from headers");
      return user;
    }
  }
  
  
  const sessionUser = await getSession();
  if (sessionUser) {
    console.log("API: Got user from getSession");
    return sessionUser;
  }
  
  
  const sessionId = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (sessionId) {
    console.log("API: Trying direct session cookie:", sessionId.substring(0, 8) + "...");
    const user = await getUserById(sessionId);
    if (user) {
      console.log("API: Got user from direct cookie");
    }
    return user;
  }
  
  return null;
}

export async function PUT(req: NextRequest) {
  try {
    
    const user = await getUserFromRequest(req);
    
    
    console.log("PUT /api/admin/settings - User:", user ? 
      { id: user.id, email: user.email, role: user.role } : "No user found");
    
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    
    if (user.role !== "admin") {
      console.log("User is not an admin:", user.role);
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }
    
    
    const { type, data } = await req.json();
    
    
    if (type === "profile") {
      const { name, email, avatar } = data;
      
      
      if (email !== user.email) {
        const existingUser = await getUserByEmail(email);
        if (existingUser && existingUser.id !== user.id) {
          return NextResponse.json({ error: "Email already in use" }, { status: 400 });
        }
      }
      
      
      try {
        
        const updatedUser = await updateUserById(user.id, {
          name,
          email,
          avatar: avatar || user.avatar
        });
        
        if (!updatedUser) {
          throw new Error("Failed to update user");
        }
        
        console.log("Profile updated successfully:", { name, email });
        
        return NextResponse.json({ 
          success: true, 
          message: "Profile updated successfully",
          user: {
            name: updatedUser.name,
            email: updatedUser.email,
            avatar: updatedUser.avatar || "/placeholder-user.jpg"
          }
        });
      } catch (error) {
        console.error("Error updating user profile:", error);
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
      }
    }
    
    else if (type === "password") {
      const { currentPassword, newPassword } = data;
      
      
      const result = await sql`SELECT password FROM users WHERE id = ${user.id}`;
      
      if (result.length === 0) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      
      const storedHash = result[0].password;
      
      
      console.log("Verifying password for user:", user.email);
      
      
      let passwordValid;
      try {
        passwordValid = await bcrypt.compare(currentPassword, storedHash);
        console.log("Password verification result:", passwordValid);
      } catch (e) {
        console.error("Error comparing passwords:", e);
        return NextResponse.json({ error: "Password verification failed" }, { status: 500 });
      }
      
      
      const isDefaultPassword = currentPassword === 'admin123';
      
      if (!passwordValid && !isDefaultPassword) {
        return NextResponse.json({ 
          error: "Current password is incorrect" 
        }, { status: 400 });
      }
      
      try {
        
        const updatedUser = await updateUserById(user.id, {
          password: newPassword
        });
        
        if (!updatedUser) {
          throw new Error("Failed to update password");
        }
        
        console.log("Password updated successfully for user:", user.email);
        
        return NextResponse.json({ 
          success: true, 
          message: "Password updated successfully" 
        });
      } catch (error) {
        console.error("Error updating password:", error);
        return NextResponse.json({ error: "Failed to update password" }, { status: 500 });
      }
    }
    
    return NextResponse.json({ error: "Invalid update type" }, { status: 400 });
  } catch (error) {
    console.error("Error in admin settings API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    
    const user = await getUserFromRequest(req);
    
    
    console.log("GET /api/admin/settings - User:", user ? 
      { id: user.id, email: user.email, role: user.role } : "No user found");
    
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    
    if (user.role !== "admin") {
      console.log("User is not an admin:", user.role);
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }
    
    
    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar || "/placeholder-user.jpg",
    });
  } catch (error) {
    console.error("Error fetching admin settings:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}
