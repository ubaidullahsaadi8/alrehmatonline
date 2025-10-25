import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"
import { hashPassword, verifyPassword } from "@/lib/auth"
import { v4 as uuidv4 } from "uuid"


export async function GET(req: NextRequest) {
  try {
    
    const session = await getSession()
    
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    
    const users = await sql`
      SELECT id, 
             length(password) as password_length,
             substring(password from 1 for 8) as password_prefix 
      FROM users 
      LIMIT 5
    `
    
    // Check bcrypt library version
    let bcryptInfo = {}
    try {
      const bcrypt = require('bcryptjs')
      bcryptInfo = {
        version: bcrypt.version || 'Unknown',
        testHash: await bcrypt.hash('test', 10).substring(0, 10) + '...',
        hashLength: (await bcrypt.hash('test', 10)).length
      }
    } catch (error) {
      bcryptInfo = { error: String(error) }
    }
    
    // Count users with different password hash lengths
    const hashStats = await sql`
      SELECT length(password) as hash_length, count(*) as count 
      FROM users 
      GROUP BY length(password)
      ORDER BY hash_length
    `
    
    return NextResponse.json({
      success: true,
      passwordHashSamples: users,
      bcryptInfo,
      hashStats
    })
  } catch (error) {
    console.error("Error in password diagnostics:", error)
    return NextResponse.json({ 
      error: "Failed to run password diagnostics", 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 })
  }
}

// This endpoint provides detailed password verification testing
export async function POST(req: NextRequest) {
  try {
    // Only admin should access this
    const session = await getSession()
    
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    // Parse request body
    const body = await req.json()
    const { password, testHash, userId } = body
    
    type TestResult = {
      name: string;
      [key: string]: any;
    }
    
    const results = {
      input: {
        password: password ? `${password} (length: ${password.length})` : "Not provided",
        testHash: testHash ? `${testHash.substring(0, 10)}... (length: ${testHash.length})` : "Not provided",
        userId: userId || "Not provided"
      },
      tests: [] as TestResult[]
    }
    
    // Test 1: Hash the password
    if (password) {
      try {
        const bcrypt = require('bcryptjs')
        const hash1 = await hashPassword(password)
        const hash2 = await bcrypt.hash(password, 10)
        
        results.tests.push({
          name: "Password Hashing",
          hash1: `${hash1.substring(0, 10)}... (length: ${hash1.length})`,
          hash2: `${hash2.substring(0, 10)}... (length: ${hash2.length})`,
          match: hash1.startsWith("$2") && hash2.startsWith("$2") ? "Both hashes are valid bcrypt" : "INVALID HASH FORMAT"
        })
      } catch (error) {
        results.tests.push({
          name: "Password Hashing",
          error: String(error)
        })
      }
    }
    
    // Test 2: Verify against provided hash
    if (password && testHash) {
      try {
        const bcrypt = require('bcryptjs')
        const isValidLib = await verifyPassword(password, testHash)
        const isValidDirect = await bcrypt.compare(password, testHash)
        
        results.tests.push({
          name: "Password Verification",
          usingLibFunction: isValidLib ? "VALID" : "INVALID",
          usingDirectBcrypt: isValidDirect ? "VALID" : "INVALID",
          match: isValidLib === isValidDirect ? "CONSISTENT" : "INCONSISTENT"
        })
      } catch (error) {
        results.tests.push({
          name: "Password Verification",
          error: String(error)
        })
      }
    }
    
    // Test 3: Check user's password if userId provided
    if (userId) {
      try {
        const user = await sql`
          SELECT id, password, 
                 length(password) as password_length,
                 substring(password from 1 for 10) as password_prefix
          FROM users 
          WHERE id = ${userId}
        `
        
        if (user.length > 0) {
          results.tests.push({
            name: "User Password Check",
            userId: userId,
            passwordHashPrefix: user[0].password_prefix,
            passwordHashLength: user[0].password_length,
            isBcryptHash: user[0].password.startsWith("$2") ? "VALID BCRYPT" : "INVALID FORMAT"
          })
          
          // If password was also provided, test against user's stored hash
          if (password) {
            const isValid = await verifyPassword(password, user[0].password)
            results.tests.push({
              name: "User Password Verification",
              result: isValid ? "VALID" : "INVALID"
            })
          }
        } else {
          results.tests.push({
            name: "User Password Check",
            error: "User not found"
          })
        }
      } catch (error) {
        results.tests.push({
          name: "User Password Check",
          error: String(error)
        })
      }
    }
    
    // Test 4: Create test user with known password
    const testPassword = "TestPassword123!"
    const testUserId = uuidv4()
    try {
      // Create test password hash
      const bcrypt = require('bcryptjs')
      const testHash = await bcrypt.hash(testPassword, 10)
      
      results.tests.push({
        name: "Test Password Generation",
        password: testPassword,
        hash: `${testHash.substring(0, 10)}... (length: ${testHash.length})`,
        validFormat: testHash.startsWith("$2") ? "VALID BCRYPT" : "INVALID FORMAT"
      })
      
      
      const verificationResult = await bcrypt.compare(testPassword, testHash)
      const libVerificationResult = await verifyPassword(testPassword, testHash)
      
      results.tests.push({
        name: "Test Hash Immediate Verification",
        directResult: verificationResult ? "VALID" : "INVALID",
        libResult: libVerificationResult ? "VALID" : "INVALID",
        consistent: verificationResult === libVerificationResult ? "YES" : "NO"
      })
      
    } catch (error) {
      results.tests.push({
        name: "Test Password Generation",
        error: String(error)
      })
    }
    
    return NextResponse.json({
      success: true,
      results
    })
  } catch (error) {
    console.error("Error in password diagnostics:", error)
    return NextResponse.json({ 
      error: "Failed to run password diagnostics", 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 })
  }
}
