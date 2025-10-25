import { sql } from "../lib/db"

async function createStudentTables() {
  try {
    
    const checkRoleColumn = await sql`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'users' AND column_name = 'role'
    `

    if (checkRoleColumn.length === 0) {
      console.log("Adding role column to users table...")
      await sql`
        ALTER TABLE users
        ADD COLUMN role VARCHAR(20) DEFAULT 'student'
      `
      console.log("✅ Role column added to users table")
    } else {
      console.log("✅ Role column already exists in users table")
    }
    
    // Create student_courses table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS student_courses (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
        status VARCHAR(20) DEFAULT 'enrolled' NOT NULL,
        fee DECIMAL(10, 2) NOT NULL,
        discount INTEGER DEFAULT 0,
        start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        end_date TIMESTAMP WITH TIME ZONE,
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE (student_id, course_id)
      )
    `
    console.log("✅ student_courses table created or already exists")
    
    // Create student_fees table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS student_fees (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
        amount DECIMAL(10, 2) NOT NULL,
        discount INTEGER DEFAULT 0,
        due_date TIMESTAMP WITH TIME ZONE NOT NULL,
        status VARCHAR(20) DEFAULT 'pending' NOT NULL,
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `
    console.log("✅ student_fees table created or already exists")
    
    // Create student_payments table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS student_payments (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        fee_id UUID REFERENCES student_fees(id) ON DELETE SET NULL,
        amount DECIMAL(10, 2) NOT NULL,
        method VARCHAR(50) NOT NULL,
        status VARCHAR(20) DEFAULT 'completed' NOT NULL,
        reference VARCHAR(100),
        description TEXT,
        date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `
    console.log("✅ student_payments table created or already exists")
    
    // Create student_messages table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS student_messages (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        subject VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `
    console.log("✅ student_messages table created or already exists")

    console.log("✅ All student management tables created successfully!")
    
  } catch (error) {
    console.error("Error creating student tables:", error)
    throw error
  }
}


createStudentTables()
  .then(() => {
    console.log("✅ Student management system database setup complete!")
    process.exit(0)
  })
  .catch((error) => {
    console.error("❌ Failed to set up student management database:", error)
    process.exit(1)
  })
