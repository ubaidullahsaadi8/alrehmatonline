#!/usr/bin/env node
require('dotenv').config();
require('ts-node').register({ transpileOnly: true });


const { neon } = require('@neondatabase/serverless');
const bcrypt = require('bcryptjs');


const sql = neon(process.env.DATABASE_URL);

async function createAdmin() {
  console.log("[v0] Creating admin user...");

  try {
    
    await sql`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user'
    `;

    // Add active column to users table if it doesn't exist
    await sql`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true
    `;

    // Check if admin user exists
    const adminExists = await sql`
      SELECT * FROM users WHERE email = 'admin@hatbrain.com'
    `;

    if (adminExists.length > 0) {
      console.log("[v0] Admin user already exists");
      return;
    }

    // Create admin user with hashed password
    const adminPassword = 'Admin@123';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const adminId = require('crypto').randomUUID();

    await sql`
      INSERT INTO users (id, email, password, name, role, active, created_at, updated_at)
      VALUES (${adminId}, 'admin@hatbrain.com', ${hashedPassword}, 'Admin User', 'admin', true, NOW(), NOW())
    `;

    console.log("[v0] Admin user created successfully!");
    console.log("Admin Credentials:");
    console.log("Email: admin@hatbrain.com");
    console.log("Password: Admin@123");
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
}

createAdmin();
