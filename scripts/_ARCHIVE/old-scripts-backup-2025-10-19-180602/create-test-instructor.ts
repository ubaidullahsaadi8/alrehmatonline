import * as dotenv from 'dotenv';
import { sql } from "../lib/db";


dotenv.config();

async function main() {
  try {
    console.log("Checking for instructors in the database...");
    
    const instructors = await sql`
      SELECT id, email, name, user_type, is_approved, active, account_status
      FROM users 
      WHERE user_type = 'instructor'
    `;
    
    console.log(`Found ${instructors.length} instructors:`);
    console.log(JSON.stringify(instructors, null, 2));

    // If no instructors found, create a test instructor
    if (instructors.length === 0) {
      console.log("No instructors found. Creating a test instructor...");
      
      // Create a test instructor
      const newInstructor = await sql`
        INSERT INTO users (
          id, 
          email, 
          password, 
          name, 
          username, 
          user_type, 
          role, 
          account_status, 
          is_approved,
          active, 
          avatar, 
          created_at, 
          updated_at, 
          currency, 
          country, 
          education
        )
        VALUES (
          ${crypto.randomUUID()}, 
          'instructor@example.com', 
          '$2b$10$YNXhmfs.cSA/PPcWR.EaX.Z/T8C2v0cHwFIH7NcbDPb0Fyo2tKAdS', 
          'Test Instructor', 
          'testinstructor', 
          'instructor', 
          'instructor', 
          'pending', 
          false,
          false, 
          NULL, 
          NOW(), 
          NOW(), 
          'USD', 
          'United States', 
          'PhD in Computer Science'
        )
        RETURNING id, email, name, user_type, is_approved, active, account_status
      `;
      
      console.log("Test instructor created:", newInstructor[0]);
    }

  } catch (error) {
    console.error("Error:", error);
  }
}

main()
  .then(() => console.log("Done"))
  .catch(console.error);
