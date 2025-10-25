import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";


dotenv.config();


if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set. Please check your .env file.");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

async function updateTestMessages() {
  try {
    
    const existingMessages = await sql`SELECT COUNT(*) as count FROM contact_messages`;
    
    if (existingMessages[0].count === '0') {
      console.log("No messages found. Creating test messages with phone numbers...");
      
      
      await sql`
        INSERT INTO contact_messages (id, name, email, phone, subject, message, created_at)
        VALUES 
          ('test-msg-1', 'John Smith', 'john@example.com', '+1 (555) 123-4567', 'Project Inquiry', 'I would like to discuss a potential web development project for my company.', NOW()),
          ('test-msg-2', 'Sarah Johnson', 'sarah@example.com', '+1 (555) 987-6543', 'Consultation Request', 'We need AI integration services for our healthcare application. When can we schedule a call?', NOW() - INTERVAL '2 days'),
          ('test-msg-3', 'Michael Chen', 'michael@example.com', NULL, 'Pricing Question', 'Could you provide more details about your mobile app development packages and pricing?', NOW() - INTERVAL '5 days')
      `;
      
      console.log("Created 3 test messages (2 with phone numbers, 1 without)");
    } else {
      // Update existing messages with phone numbers
      await sql`
        UPDATE contact_messages 
        SET phone = CASE 
          WHEN id = 'test-message-1' THEN '+1 (555) 123-4567'
          ELSE '+1 (555) 987-6543'
        END
        WHERE id IN ('test-message-1', 'msg-2', 'msg-3')
      `;
      
      console.log("Updated existing test messages with phone numbers");
    }
    
    // Verify messages
    const messages = await sql`
      SELECT id, name, email, phone, subject 
      FROM contact_messages 
      ORDER BY created_at DESC
      LIMIT 5
    `;
    
    console.log("Recent messages:", messages);
    
  } catch (error) {
    console.error("Error updating messages:", error);
  }
}

updateTestMessages().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
