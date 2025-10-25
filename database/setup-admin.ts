import { neon } from "@neondatabase/serverless"
import * as readline from "readline"
import { config } from "dotenv"

// Load .env file
config()

const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  console.error("❌ ERROR: DATABASE_URL environment variable is not set")
  console.error("Please set DATABASE_URL in your .env file")
  process.exit(1)
}

const sql = neon(DATABASE_URL)

// ============================================================================
// 🔧 CONFIGURE YOUR ADMIN CREDENTIALS HERE
// ============================================================================

const ADMIN_CONFIG = {
  email: "admin@hatbrain.tech",           // ← Change this to your email
  password: "admin123",                   // ← Change this to a strong password
  name: "Admin User",                     // ← Change this to your name
  username: "admin",                      // ← Change this to your username
  currency: "USD"                         // ← Change if needed (USD, EUR, PKR, etc.)
}

// ============================================================================

const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
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
      "\n✅ Are these credentials correct? Type 'yes' to continue: ",
      (answer) => {
        rl.close()
        resolve(answer.toLowerCase() === "yes")
      }
    )
  })
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

async function setupAdmin() {
  log("\n" + "=".repeat(70), "cyan")
  log("  🔐 ADMIN USER SETUP", "bright")
  log("=".repeat(70) + "\n", "cyan")

  // Display configuration
  log("📋 Admin Configuration:", "cyan")
  log(`   Email:    ${ADMIN_CONFIG.email}`, "blue")
  log(`   Password: ${ADMIN_CONFIG.password}`, "blue")
  log(`   Name:     ${ADMIN_CONFIG.name}`, "blue")
  log(`   Username: ${ADMIN_CONFIG.username}`, "blue")
  log(`   Currency: ${ADMIN_CONFIG.currency}`, "blue")

  // Ask for confirmation
  const confirmed = await askConfirmation()
  
  if (!confirmed) {
    log("\n❌ Setup cancelled. Please update credentials in database/setup-admin.ts", "red")
    process.exit(0)
  }

  try {
    // Test connection
    const connected = await testConnection()
    if (!connected) {
      throw new Error("Database connection failed")
    }

    // Check if users table exists
    log("\n🔍 Checking if users table exists...", "yellow")
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      ) as exists
    `

    if (!tableCheck[0]?.exists) {
      log("⚠️  Users table does not exist yet", "yellow")
      log("ℹ️  Please run 'npm run db:migrate' first", "blue")
      process.exit(1)
    }

    // Check if admin already exists
    log("🔍 Checking if admin user already exists...", "yellow")
    const adminCheck = await sql`
      SELECT id, email FROM users WHERE email = ${ADMIN_CONFIG.email} LIMIT 1
    `

    if (adminCheck.length > 0) {
      log("\n⚠️  Admin user with this email already exists!", "yellow")
      log(`   Email: ${adminCheck[0].email}`, "blue")
      
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      })

      const updateConfirm = await new Promise<boolean>((resolve) => {
        rl.question(
          "\n❓ Do you want to UPDATE this user? Type 'yes' to update: ",
          (answer) => {
            rl.close()
            resolve(answer.toLowerCase() === "yes")
          }
        )
      })

      if (!updateConfirm) {
        log("\n✅ Setup cancelled. No changes made.", "green")
        process.exit(0)
      }

      // Update existing admin
      log("\n🔄 Updating admin user...", "yellow")
      
      const bcrypt = require("bcryptjs")
      const hashedPassword = await bcrypt.hash(ADMIN_CONFIG.password, 10)

      await sql`
        UPDATE users
        SET 
          password = ${hashedPassword},
          name = ${ADMIN_CONFIG.name},
          username = ${ADMIN_CONFIG.username},
          role = 'admin',
          user_type = 'simple',
          account_status = 'active',
          is_approved = true,
          active = true,
          currency = ${ADMIN_CONFIG.currency},
          updated_at = CURRENT_TIMESTAMP
        WHERE email = ${ADMIN_CONFIG.email}
      `

      log("\n✅ Admin user updated successfully!", "green")
    } else {
      // Create new admin
      log("\n👤 Creating admin user...", "yellow")
      
      const bcrypt = require("bcryptjs")
      const hashedPassword = await bcrypt.hash(ADMIN_CONFIG.password, 10)
      const adminId = crypto.randomUUID()

      await sql`
        INSERT INTO users (
          id, email, password, name, username, role, user_type,
          account_status, is_approved, active, currency, created_at, updated_at
        )
        VALUES (
          ${adminId}, 
          ${ADMIN_CONFIG.email}, 
          ${hashedPassword}, 
          ${ADMIN_CONFIG.name}, 
          ${ADMIN_CONFIG.username}, 
          'admin', 
          'simple',
          'active', 
          true, 
          true, 
          ${ADMIN_CONFIG.currency},
          CURRENT_TIMESTAMP, 
          CURRENT_TIMESTAMP
        )
      `

      log("\n✅ Admin user created successfully!", "green")
    }

    // Display credentials
    log("\n" + "=".repeat(70), "green")
    log("  ✅ ADMIN SETUP COMPLETE", "bright")
    log("=".repeat(70), "green")
    log("\n📋 Login Credentials:", "cyan")
    log(`   URL:      http://localhost:3000/login`, "blue")
    log(`   Email:    ${ADMIN_CONFIG.email}`, "blue")
    log(`   Password: ${ADMIN_CONFIG.password}`, "blue")
    log("\n⚠️  IMPORTANT: Change your password after first login!", "yellow")
    log("\n" + "=".repeat(70) + "\n", "green")

    process.exit(0)
  } catch (error) {
    log("\n❌ Admin setup failed", "red")
    console.error(error)
    process.exit(1)
  }
}

// Run setup
setupAdmin()
