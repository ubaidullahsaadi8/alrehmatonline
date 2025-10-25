import { sql } from "./db"
import bcrypt from "bcryptjs"

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  console.log("Verifying password - Received inputs:", {
    passwordLength: password?.length,
    hashedPasswordLength: hashedPassword?.length,
    hashedPasswordPrefix: hashedPassword?.substring(0, 10) + '...'
  })
  
  if (!password || !hashedPassword) {
    console.error("Verifying password - Missing password or hashedPassword")
    return false
  }
  
  
  if (!hashedPassword.startsWith('$2')) {
    console.error("Verifying password - Invalid hash format, not a bcrypt hash")
    console.error(`Hash prefix: ${hashedPassword.substring(0, 10)}`)
    return false
  }
  
  try {
    
    const isValid = await bcrypt.compare(password, hashedPassword)
    
    console.log("Password verification result:", isValid ? "SUCCESS" : "FAILED")
    
    
    if (!isValid) {
      console.log(`Password length: ${password.length}`)
      console.log(`Hash length: ${hashedPassword.length}`)
      console.log(`Password first char code: ${password.charCodeAt(0)}`)
      console.log(`Hash format valid: ${hashedPassword.startsWith('$2') ? 'Yes' : 'No'}`)
      
      
      const testHash = await bcrypt.hash(password, 10)
      console.log(`Test hash: ${testHash.substring(0, 10)}... (length: ${testHash.length})`)
    }
    
    return isValid
  } catch (error) {
    console.error("Error during password verification:", error)
    console.error(`Error details: ${JSON.stringify(error)}`)
    return false
  }
}


export function generateRandomUsername(): string {
  const randomChars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let username = 'hb';
  
  
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * randomChars.length);
    username += randomChars[randomIndex];
  }
  
  return username;
}


export async function checkUsernameExists(username: string): Promise<boolean> {
  try {
    const result = await sql`
      SELECT id FROM users WHERE username = ${username} LIMIT 1
    `;
    return result.length > 0;
  } catch (error) {
    console.error("Error checking username:", error);
    return false; // Default to false to prevent potential username collisions
  }
}

export async function createUser(
  email: string, 
  password: string, 
  name: string, 
  username?: string, 
  userType: string = 'simple',
  currency: string = 'USD',
  country?: string,
  education?: string,
  role: string = 'user'
) {
  try {
    const hashedPassword = await hashPassword(password)
    const id = crypto.randomUUID()

    console.log(`Creating user with email: ${email}, name: ${name}, type: ${userType}, role: ${role}`)
    
    // Generate username if not provided
    let finalUsername = username;
    if (!finalUsername) {
      // Try to generate a unique username
      let attempts = 0;
      let isUnique = false;
      
      while (!isUnique && attempts < 5) {
        finalUsername = generateRandomUsername();
        isUnique = !(await checkUsernameExists(finalUsername));
        attempts++;
      }
      
      if (!isUnique) {
        // If we couldn't generate a unique username after 5 attempts, 
        // add a timestamp to make it unique
        finalUsername = `hb${Date.now().toString(36)}`;
      }
    }
    
    // Set approval status and account status based on user type
    const isApproved = userType !== 'instructor'; // Only instructors need approval
    const accountStatus = userType === 'instructor' ? 'pending' : 'active';
    
    // Determine active status based on user type
    // Instructors are inactive until approved by an admin
    const isActive = userType !== 'instructor';
    
    const result = await sql`
      INSERT INTO users (
        id, email, password, name, username, user_type, role, account_status, is_approved,
        active, avatar, created_at, updated_at, currency, country, education
      )
      VALUES (
        ${id}, ${email}, ${hashedPassword}, ${name}, ${finalUsername}, ${userType}, 
        ${role}, ${accountStatus}, ${isApproved}, ${isActive}, NULL, NOW(), NOW(), 
        ${currency}, ${country || null}, ${education || null}
      )
      RETURNING id, email, name, username, user_type, role, account_status, is_approved, 
                active, avatar, created_at as "createdAt"
    `

    if (!result || result.length === 0) {
      throw new Error("Failed to create user: No result returned")
    }

    console.log("User created successfully:", { id, email, name, userType })
    return result[0]
  } catch (error: any) {
    console.error("Error creating user:", error.message || error)
    
    // More detailed error logging
    if (error.code) {
      console.error(`Database error code: ${error.code}`)
    }
    
    throw error
  }
}

export async function getUserByEmail(email: string) {
  try {
    const result = await sql`
      SELECT 
        id, 
        email, 
        password, 
        name,
        username,
        avatar,
        role,
        active,
        user_type,
        account_status,
        is_approved,
        currency,
        country, 
        created_at as "createdAt", 
        updated_at as "updatedAt" 
      FROM users 
      WHERE email = ${email} 
      LIMIT 1
    `
    return result[0] || null
  } catch (error) {
    console.error("Error getting user by email:", error)
    return null
  }
}

export async function getUserByUsername(username: string) {
  try {
    const result = await sql`
      SELECT 
        id, 
        email, 
        password, 
        name,
        username,
        avatar,
        role,
        active,
        user_type,
        account_status, 
        is_approved,
        currency,
        country,
        created_at as "createdAt", 
        updated_at as "updatedAt" 
      FROM users 
      WHERE username = ${username} 
      LIMIT 1
    `
    return result[0] || null
  } catch (error) {
    console.error("Error getting user by username:", error)
    return null
  }
}

export async function getUserById(id: string) {
  try {
    const result = await sql`
      SELECT 
        id, 
        email, 
        password,
        name,
        username,
        avatar,
        role,
        active,
        user_type,
        account_status,
        is_approved,
        currency,
        country,
        education,
        member_type,
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM users 
      WHERE id = ${id} 
      LIMIT 1
    `
    return result[0] || null
  } catch (error) {
    console.error("Error getting user by ID:", error)
    return null
  }
}

export async function updateUserById(id: string, updates: {
  name?: string;
  email?: string;
  password?: string;
  avatar?: string;
  active?: boolean;
  username?: string;
  user_type?: string;
  account_status?: string;
  is_approved?: boolean;
  currency?: string;
  country?: string;
  education?: string;
  member_type?: string;
}) {
  try {
    // Handle each update field separately for safety
    // Prepare password hash if needed
    let passwordHash = undefined;
    if (updates.password !== undefined) {
      passwordHash = await hashPassword(updates.password);
    }
    
    // If approving an instructor, automatically set active to true and account_status to active
    let accountStatus = updates.account_status;
    let activeStatus = updates.active;
    
    // If the user is being approved as an instructor
    if (updates.is_approved === true) {
      // Get current user details to check if they're an instructor
      const user = await getUserById(id);
      if (user && user.user_type === 'instructor') {
        // Automatically activate the account when approving an instructor
        accountStatus = 'active';
        activeStatus = true;
        console.log(`Activating instructor account: ${id}`);
      }
    }
    
    // Update the user with the provided fields
    const result = await sql`
      UPDATE users
      SET 
        name = COALESCE(${updates.name}, name),
        email = COALESCE(${updates.email}, email),
        password = COALESCE(${passwordHash}, password),
        avatar = COALESCE(${updates.avatar}, avatar),
        active = COALESCE(${activeStatus}, active),
        username = COALESCE(${updates.username}, username),
        user_type = COALESCE(${updates.user_type}, user_type),
        account_status = COALESCE(${accountStatus}, account_status),
        is_approved = COALESCE(${updates.is_approved}, is_approved),
        currency = COALESCE(${updates.currency}, currency),
        country = COALESCE(${updates.country}, country),
        education = COALESCE(${updates.education}, education),
        member_type = COALESCE(${updates.member_type}, member_type),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING id, email, name, username, avatar, role, active, user_type, 
                account_status, is_approved, currency, country, education, member_type
    `;
    
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("Error updating user:", error);
    return null;
  }
}

export async function updateUserCurrency(userId: string, currency: string) {
  try {
    const result = await sql`
      UPDATE users
      SET 
        currency = ${currency},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${userId}
      RETURNING id, email, name, currency
    `;
    
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("Error updating user currency:", error);
    return null;
  }
}

/**
 * Approve an instructor account
 * This function specifically handles instructor approval, setting all necessary flags
 */
export async function approveInstructor(instructorId: string, sendNotification: boolean = true) {
  try {
    // First, verify that this is indeed an instructor account
    const user = await getUserById(instructorId);
    
    if (!user) {
      console.error(`Cannot approve instructor: User ${instructorId} not found`);
      return { success: false, error: "User not found" };
    }
    
    if (user.user_type !== 'instructor') {
      console.error(`Cannot approve instructor: User ${instructorId} is not an instructor (type: ${user.user_type})`);
      return { success: false, error: "User is not an instructor" };
    }
    
    
    const result = await sql`
      UPDATE users
      SET 
        is_approved = true,
        active = true,
        account_status = 'active',
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${instructorId} AND user_type = 'instructor'
      RETURNING id, email, name, user_type, is_approved, active, account_status
    `;
    
    if (result.length === 0) {
      return { success: false, error: "Failed to update instructor status" };
    }
    
    // Here you would add code to send notification if sendNotification is true
    if (sendNotification) {
      // TO DO: Send email notification to instructor that they are approved
      console.log(`Should send approval notification to instructor ${instructorId}`);
    }
    
    console.log(`Instructor ${instructorId} approved successfully`);
    return { success: true, user: result[0] };
  } catch (error) {
    console.error("Error approving instructor:", error);
    return { success: false, error: "Database error" };
  }
}
