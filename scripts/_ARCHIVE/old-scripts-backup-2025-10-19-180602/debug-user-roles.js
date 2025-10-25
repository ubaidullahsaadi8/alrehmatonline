require('dotenv').config();
const { Pool } = require('pg');


if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set!");
  console.log("Looking for .env file with DATABASE_URL instead...");
}


async function debugUserRoles() {
  let client;
  
  try {
    
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("No DATABASE_URL found in environment variables or .env file");
    }
    
    client = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false
      }
    });
    
    await client.connect();
    console.log("Connected to the database successfully!");

    
    const checkUsersTableResult = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      ) as exists
    `);
    
    if (!checkUsersTableResult.rows[0].exists) {
      console.log("❌ Users table does not exist!");
      return;
    }
    
    console.log("✅ Users table exists");
    
    
    const userColumnsResult = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users'
      ORDER BY ordinal_position
    `);
    
    console.log("✅ Users table schema:");
    console.table(userColumnsResult.rows);
    
    
    const hasRoleColumn = userColumnsResult.rows.some(col => col.column_name === 'role');
    
    if (!hasRoleColumn) {
      console.log("❌ Role column does not exist in users table!");
      console.log("Adding role column to users table...");
      
      await client.query(`
        ALTER TABLE users
        ADD COLUMN role VARCHAR(20) DEFAULT 'student'
      `);
      
      console.log("✅ Role column added to users table");
    } else {
      console.log("✅ Role column exists in users table");
    }
    
    
    const userRoleCountsResult = await client.query(`
      SELECT role, COUNT(*) as count
      FROM users
      GROUP BY role
      ORDER BY count DESC
    `);
    
    console.log("✅ User counts by role:");
    console.table(userRoleCountsResult.rows);
    
    
    const totalUsersResult = await client.query(`
      SELECT COUNT(*) as count FROM users
    `);
    
    console.log(`✅ Total users in database: ${totalUsersResult.rows[0].count}`);
    
    
    const sampleUsersResult = await client.query(`
      SELECT id, name, email, role, created_at
      FROM users
      LIMIT 10
    `);
    
    console.log("✅ Sample users:");
    console.table(sampleUsersResult.rows);
    
    
    const nullRolesResult = await client.query(`
      SELECT COUNT(*) as count
      FROM users
      WHERE role IS NULL OR role = ''
    `);
    
    console.log(`✅ Users with NULL or empty role: ${nullRolesResult.rows[0].count}`);
    
    if (parseInt(nullRolesResult.rows[0].count) > 0) {
      console.log("Would you like to update these users to have role='student'? (yes/no)");
      console.log("Run this command to update them:");
      console.log("UPDATE users SET role = 'student' WHERE role IS NULL OR role = '';");
    }
    
  } catch (error) {
    console.error("Error debugging user roles:", error);
    throw error;
  } finally {
    if (client) {
      await client.end();
    }
  }
}


debugUserRoles()
  .then(() => {
    console.log("✅ User role debugging complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Failed to debug user roles:", error);
    process.exit(1);
  });
