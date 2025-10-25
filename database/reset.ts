#!/usr/bin/env tsx
/**
 * HatBrain Database Reset Script
 * Version: 1.0.0
 * 
 * ⚠️  WARNING: This script will DELETE ALL DATA in the database!
 * Use only for development or when you need a fresh start.
 * 
 * Usage:
 *   npm run db:reset
 */

import { neon } from "@neondatabase/serverless"
import * as readline from "readline"
import { config } from "dotenv"

// Load .env file
config()

const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  console.error("❌ ERROR: DATABASE_URL environment variable is not set")
  process.exit(1)
}

const sql = neon(DATABASE_URL)

const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  green: "\x1b[32m",
}

function log(message: string, color: keyof typeof colors = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

async function askConfirmation(): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise((resolve) => {
    rl.question(
      "\n⚠️  Are you sure you want to DELETE ALL DATA? Type 'yes' to confirm: ",
      (answer) => {
        rl.close()
        resolve(answer.toLowerCase() === "yes")
      }
    )
  })
}

async function dropAllTables() {
  log("\n🗑️  Dropping all tables...", "yellow")
  
  const tables = [
    "notification_reads",
    "instructor_notifications",
    "instructor_payments",
    "instructor_salary",
    "student_fees",
    "class_meetings",
    "student_classes",
    "classes",
    "course_notifications",
    "enrollments",
    "service_bookings",
    "services",
    "testimonials",
    "contact_messages",
    "courses",
    "settings",
    "users"
  ]
  
  for (const table of tables) {
    try {
      await sql.unsafe(`DROP TABLE IF EXISTS ${table} CASCADE`)
      log(`   ✅ Dropped ${table}`, "green")
    } catch (error: any) {
      log(`   ⚠️  Could not drop ${table}: ${error.message}`, "yellow")
    }
  }
  
  log("\n✅ All tables dropped", "green")
}

async function main() {
  log("\n" + "=".repeat(70), "red")
  log("  ⚠️  DATABASE RESET WARNING", "red")
  log("=".repeat(70), "red")
  log("\nThis will DELETE ALL DATA from your database!", "red")
  log("This action CANNOT be undone!\n", "red")
  
  const confirmed = await askConfirmation()
  
  if (!confirmed) {
    log("\n✅ Reset cancelled. No changes made.", "green")
    process.exit(0)
  }
  
  try {
    await dropAllTables()
    
    log("\n" + "=".repeat(70), "green")
    log("  ✅ DATABASE RESET COMPLETE", "green")
    log("=".repeat(70), "green")
    log("\nYou can now run 'npm run db:migrate' to create fresh tables.\n", "yellow")
    
    process.exit(0)
  } catch (error) {
    log("\n❌ Reset failed", "red")
    console.error(error)
    process.exit(1)
  }
}

main()
