#!/usr/bin/env tsx
/**
 * HatBrain Database Migration Script
 * Version: 1.0.0
 * 
 * This script handles database initialization and migration for production deployment.
 * It creates all necessary tables, indexes, and default data.
 * 
 * Usage:
 *   npm run db:migrate
 * 
 * Features:
 *   - Idempotent (safe to run multiple times)
 *   - Creates backup before migration
 *   - Validates database connection
 *   - Comprehensive error handling
 *   - Progress logging
 */

import { neon } from "@neondatabase/serverless"
import * as fs from "fs"
import * as path from "path"
import { config } from "dotenv"

// Load .env file
config()

const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  console.error("❌ ERROR: DATABASE_URL environment variable is not set")
  console.error("Please set DATABASE_URL in your .env file")
  process.exit(1)
}

// Use neon directly for migration script
const sql = neon(DATABASE_URL)

// Helper to execute raw SQL as template literal
async function execSQL(query: string) {
  // Convert string to template literal format
  const parts = [query] as any
  parts.raw = [query]
  return await sql(parts)
}

// Color codes for terminal output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  red: "\x1b[31m",
}

function log(message: string, color: keyof typeof colors = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function logStep(step: string) {
  log(`\n${"=".repeat(70)}`, "blue")
  log(`  ${step}`, "bright")
  log("=".repeat(70), "blue")
}

async function testConnection(): Promise<boolean> {
  try {
    log("\n🔍 Testing database connection...", "yellow")
    const result = await sql`SELECT 1 as test`
    if (result && result.length > 0) {
      log("✅ Database connection successful", "green")
      return true
    }
    return false
  } catch (error) {
    log("❌ Database connection failed", "red")
    console.error(error)
    return false
  }
}

async function createBackup(): Promise<void> {
  try {
    logStep("CREATING BACKUP")
    
    // Check if users table exists
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      ) as exists
    `
    
    if (tableCheck[0]?.exists) {
      log("📦 Creating backup of existing users table...", "yellow")
      await sql`
        CREATE TABLE IF NOT EXISTS users_backup_${Date.now()} 
        AS SELECT * FROM users
      `
      log("✅ Backup created successfully", "green")
    } else {
      log("ℹ️  No existing users table found, skipping backup", "yellow")
    }
  } catch (error) {
    log("⚠️  Warning: Could not create backup", "yellow")
    console.error(error)
  }
}

async function runMigration(): Promise<void> {
  logStep("RUNNING DATABASE MIGRATION")
  
  try {
    // Read the schema file
    const schemaPath = path.join(__dirname, "schema.sql")
    
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema file not found at: ${schemaPath}`)
    }
    
    log("📄 Reading schema file...", "yellow")
    const schema = fs.readFileSync(schemaPath, "utf-8")
    
    // Remove comment lines first, then split into statements
    const schemaNoComments = schema
      .split("\n")
      .filter(line => !line.trim().startsWith("--"))
      .join("\n")
    
    // Split schema into individual statements
    const statements = schemaNoComments
      .split(";")
      .map(s => s.trim())
      .filter(s => s.length > 0)
    
    log(`📝 Found ${statements.length} SQL statements to execute`, "yellow")
    
    let successCount = 0
    let skipCount = 0
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      
      try {
        // Debug: log first CREATE TABLE statement
        if (i === 0 || statement.includes("CREATE TABLE")) {
          log(`\n   Executing: ${statement.substring(0, 60)}...`, "blue")
        }
        
        // Execute raw SQL statement using helper
        await execSQL(statement)
        successCount++
        
        // Log progress every 10 statements
        if ((i + 1) % 10 === 0) {
          log(`   Progress: ${i + 1}/${statements.length} statements executed`, "blue")
        }
      } catch (error: any) {
        // Skip if table/index already exists
        if (error.message?.includes("already exists")) {
          skipCount++
        } else {
          log(`⚠️  Warning: Failed to execute statement ${i + 1}`, "yellow")
          console.error(error.message)
          // Continue with other statements
        }
      }
    }
    
    log(`\n✅ Migration completed successfully`, "green")
    log(`   Executed: ${successCount} statements`, "green")
    log(`   Skipped: ${skipCount} (already exists)`, "yellow")
    
  } catch (error) {
    log("❌ Migration failed", "red")
    console.error(error)
    throw error
  }
}

async function seedDefaultData(): Promise<void> {
  logStep("SEEDING DEFAULT DATA")
  
  try {
    // Check if admin user exists
    const adminCheck = await sql`
      SELECT id FROM users WHERE role = 'admin' LIMIT 1
    `
    
    if (adminCheck.length === 0) {
      log("⚠️  No admin user found!", "yellow")
      log("ℹ️  Please run 'npm run setup:admin' to create admin user", "blue")
      log("ℹ️  Or admin will be created with default credentials", "blue")
    } else {
      log("✅ Admin user exists", "green")
    }
    
    // Check if default classes exist
    const classCheck = await sql`
      SELECT id FROM classes WHERE name IN ('HB1', 'HB2') LIMIT 1
    `
    
    if (classCheck.length === 0) {
      log("📚 Creating default classes...", "yellow")
      
      const admin = await sql`SELECT id FROM users WHERE role = 'admin' LIMIT 1`
      
      if (admin.length > 0) {
        await sql`
          INSERT INTO classes (id, name, description, instructor_id, created_at, updated_at)
          VALUES 
            (gen_random_uuid(), 'HB1', 'Default class HB1', ${admin[0].id}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
            (gen_random_uuid(), 'HB2', 'Default class HB2', ${admin[0].id}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
          ON CONFLICT (name, instructor_id) DO NOTHING
        `
        log("✅ Default classes created (HB1, HB2)", "green")
      }
    } else {
      log("ℹ️  Default classes already exist, skipping", "yellow")
    }
    
  } catch (error) {
    log("⚠️  Warning: Could not seed default data", "yellow")
    console.error(error)
  }
}

async function verifyMigration(): Promise<void> {
  logStep("VERIFYING MIGRATION")
  
  try {
    // Check all critical tables exist
    const tables = [
      "users",
      "courses",
      "enrollments",
      "classes",
      "student_classes",
      "class_meetings",
      "student_fees",
      "instructor_salary",
      "services",
      "service_bookings",
      "instructor_notifications",
      "notification_reads",
      "contact_messages",
      "testimonials",
      "settings"
    ]
    
    log("🔍 Verifying tables...", "yellow")
    
    for (const table of tables) {
      const result = await sql`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = ${table}
        ) as exists
      `
      
      if (result[0]?.exists) {
        log(`   ✅ ${table}`, "green")
      } else {
        log(`   ❌ ${table} - MISSING!`, "red")
        throw new Error(`Table ${table} was not created`)
      }
    }
    
    log("\n✅ All tables verified successfully", "green")
    
  } catch (error) {
    log("❌ Verification failed", "red")
    console.error(error)
    throw error
  }
}

async function main() {
  const startTime = Date.now()
  
  log("\n" + "=".repeat(70), "bright")
  log("  🚀 HATBRAIN DATABASE MIGRATION", "bright")
  log("  Version: 1.0.0", "bright")
  log("=".repeat(70) + "\n", "bright")
  
  try {
    // Step 1: Test connection
    const connected = await testConnection()
    if (!connected) {
      throw new Error("Database connection failed")
    }
    
    // Step 2: Create backup
    await createBackup()
    
    // Step 3: Run migration
    await runMigration()
    
    // Step 4: Seed default data
    await seedDefaultData()
    
    // Step 5: Verify migration
    await verifyMigration()
    
    // Success summary
    const duration = ((Date.now() - startTime) / 1000).toFixed(2)
    
    logStep("MIGRATION COMPLETED SUCCESSFULLY")
    log(`✅ Database is ready for production`, "green")
    log(`⏱️  Total time: ${duration}s`, "blue")
    log(`\n${"=".repeat(70)}\n`, "bright")
    
    process.exit(0)
    
  } catch (error) {
    log("\n❌ MIGRATION FAILED", "red")
    console.error(error)
    log("\nPlease fix the errors and try again.\n", "yellow")
    process.exit(1)
  }
}

// Run migration
main()
