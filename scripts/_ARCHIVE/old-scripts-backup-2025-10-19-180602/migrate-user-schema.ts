import { sql } from "@/lib/db";

async function main() {
  try {
    console.log("Starting database migration...");
    
    
    console.log("Creating backup of users table...");
    await sql`CREATE TABLE IF NOT EXISTS users_backup AS SELECT * FROM users`;
    console.log("Backup created successfully.");
    
    
    console.log("Adding new columns to users table...");
    
    
    try {
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS username TEXT UNIQUE`;
      console.log("Added username column.");
    } catch (error) {
      console.warn("Error adding username column (might already exist):", error);
    }
    
    
    try {
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS user_type TEXT DEFAULT 'simple'`;
      console.log("Added user_type column.");
    } catch (error) {
      console.warn("Error adding user_type column (might already exist):", error);
    }
    
    // Add account_status column
    try {
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS account_status TEXT DEFAULT 'active'`;
      console.log("Added account_status column.");
    } catch (error) {
      console.warn("Error adding account_status column (might already exist):", error);
    }
    
    // Add is_approved column
    try {
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false`;
      console.log("Added is_approved column.");
    } catch (error) {
      console.warn("Error adding is_approved column (might already exist):", error);
    }
    
    
    try {
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS country TEXT`;
      console.log("Added country column.");
    } catch (error) {
      console.warn("Error adding country column (might already exist):", error);
    }
    
    
    try {
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS education TEXT`;
      console.log("Added education column.");
    } catch (error) {
      console.warn("Error adding education column (might already exist):", error);
    }
    
    
    try {
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS member_type TEXT DEFAULT 'common'`;
      console.log("Added member_type column.");
    } catch (error) {
      console.warn("Error adding member_type column (might already exist):", error);
    }
    
    // Create classes table
    console.log("Creating classes table...");
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS classes (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          instructor_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(name, instructor_id)
        )
      `;
      console.log("Created classes table.");
    } catch (error) {
      console.warn("Error creating classes table:", error);
    }
    
    // Create student_classes table
    console.log("Creating student_classes table...");
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS student_classes (
          id TEXT PRIMARY KEY,
          student_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          class_id TEXT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
          joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          status TEXT DEFAULT 'active',
          UNIQUE(student_id, class_id)
        )
      `;
      console.log("Created student_classes table.");
    } catch (error) {
      console.warn("Error creating student_classes table:", error);
    }
    
    // Create class_meetings table
    console.log("Creating class_meetings table...");
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS class_meetings (
          id TEXT PRIMARY KEY,
          class_id TEXT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
          title TEXT NOT NULL,
          description TEXT,
          meeting_link TEXT NOT NULL,
          meeting_date DATE NOT NULL,
          meeting_time TEXT NOT NULL,
          duration INTEGER DEFAULT 60,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `;
      console.log("Created class_meetings table.");
    } catch (error) {
      console.warn("Error creating class_meetings table:", error);
    }
    
    // Create instructor_notifications table
    console.log("Creating instructor_notifications table...");
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS instructor_notifications (
          id TEXT PRIMARY KEY,
          instructor_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          title TEXT NOT NULL,
          message TEXT NOT NULL,
          type TEXT DEFAULT 'message',
          send_to_all BOOLEAN DEFAULT false,
          class_id TEXT,
          student_id TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `;
      console.log("Created instructor_notifications table.");
    } catch (error) {
      console.warn("Error creating instructor_notifications table:", error);
    }
    
    // Create settings table
    console.log("Creating settings table...");
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS settings (
          id TEXT PRIMARY KEY DEFAULT '1',
          org_name TEXT DEFAULT 'HatBrain',
          org_logo TEXT,
          primary_color TEXT DEFAULT '#6d28d9',
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `;
      console.log("Created settings table.");
    } catch (error) {
      console.warn("Error creating settings table:", error);
    }
    
    // Insert default settings if not exists
    console.log("Adding default settings...");
    try {
      await sql`
        INSERT INTO settings (id, org_name, primary_color)
        VALUES ('1', 'HatBrain', '#6d28d9')
        ON CONFLICT (id) DO NOTHING
      `;
      console.log("Added default settings.");
    } catch (error) {
      console.warn("Error adding default settings:", error);
    }
    
    // Create default classes
    console.log("Creating default classes...");
    try {
      // Find admin user
      const admins = await sql`SELECT id FROM users WHERE role = 'admin' LIMIT 1`;
      
      if (admins && admins.length > 0) {
        const adminId = admins[0].id;
        
        
        await sql`
          INSERT INTO classes (id, name, description, instructor_id)
          VALUES 
            (gen_random_uuid(), 'HB1', 'Default class HB1', ${adminId}),
            (gen_random_uuid(), 'HB2', 'Default class HB2', ${adminId})
          ON CONFLICT (name, instructor_id) DO NOTHING
        `;
        console.log("Created default classes HB1 and HB2.");
      } else {
        console.warn("No admin user found to assign default classes.");
      }
    } catch (error) {
      console.warn("Error creating default classes:", error);
    }
    
    // Update existing users to be approved
    console.log("Updating existing users...");
    try {
      await sql`
        UPDATE users
        SET is_approved = true
        WHERE role = 'admin' OR role = 'user'
      `;
      console.log("Updated existing users.");
    } catch (error) {
      console.warn("Error updating existing users:", error);
    }

    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  }
}

main()
  .catch(e => {
    console.error("Migration script error:", e);
    process.exit(1);
  });
