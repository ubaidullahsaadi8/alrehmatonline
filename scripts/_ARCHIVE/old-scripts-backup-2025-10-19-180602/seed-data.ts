import { neon } from "@neondatabase/serverless"
import dotenv from "dotenv"


dotenv.config()

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set. Please check your .env file.")
  process.exit(1)
}

console.log("DATABASE_URL is configured:", process.env.DATABASE_URL ? "YES" : "NO")

const sql = neon(process.env.DATABASE_URL)

import bcrypt from "bcryptjs"

async function seedData() {
  console.log("[v0] Starting data seeding...")
  
  
  const adminPassword = await bcrypt.hash("admin123", 10)
  
  await sql`
    INSERT INTO users (id, email, password, name, role, created_at, updated_at)
    VALUES ('admin-user', 'admin@example.com', ${adminPassword}, 'Admin User', 'admin', NOW(), NOW())
    ON CONFLICT (id) DO NOTHING
  `
  
  console.log("[v0] Admin user created with email: admin@example.com and password: admin123")
  
  // Create a test contact message
  await sql`
    INSERT INTO contact_messages (id, name, email, subject, message)
    VALUES ('test-message-1', 'Test User', 'test@example.com', 'Test Subject', 'This is a test message.')
    ON CONFLICT (id) DO NOTHING
  `
  
  await sql`
    INSERT INTO courses (id, title, description, image, price, duration, level, instructor, category, featured)
    VALUES 
      ('course-1', 'Full Stack Web Development', 'Master modern web development with React, Node.js, and PostgreSQL. Build production-ready applications from scratch.', '/web-development-coding.png', 299.99, '12 weeks', 'Intermediate', 'Sarah Johnson', 'Development', true),
      ('course-2', 'AI & Machine Learning', 'Learn artificial intelligence and machine learning fundamentals. Build intelligent applications with Python and TensorFlow.', '/ai-neural-network.png', 399.99, '16 weeks', 'Advanced', 'Dr. Michael Chen', 'AI/ML', true),
      ('course-3', 'Mobile App Development', 'Create stunning mobile apps for iOS and Android using React Native. Deploy to app stores with confidence.', '/mobile-app-development.png', 349.99, '10 weeks', 'Intermediate', 'Alex Rodriguez', 'Mobile', false),
      ('course-4', 'Cloud Architecture', 'Design and deploy scalable cloud solutions on AWS, Azure, and Google Cloud. Master DevOps practices.', '/cloud-computing-architecture.png', 449.99, '14 weeks', 'Advanced', 'Emily Watson', 'Cloud', true)
    ON CONFLICT (id) DO NOTHING
  `

  await sql`
    INSERT INTO services (id, title, description, image, features, price, featured)
    VALUES 
      ('service-1', 'Custom Software Development', 'We build tailored software solutions that perfectly fit your business needs. From web applications to enterprise systems.', '/custom-software-development.png', ARRAY['Full-stack development', 'API integration', 'Database design', 'Quality assurance', '24/7 support'], 'Starting at $5,000', true),
      ('service-2', 'Mobile App Development', 'Native and cross-platform mobile applications that deliver exceptional user experiences on iOS and Android.', '/mobile-app-design-concept.png', ARRAY['iOS development', 'Android development', 'React Native', 'UI/UX design', 'App store deployment'], 'Starting at $8,000', true),
      ('service-3', 'Cloud Solutions', 'Migrate to the cloud or optimize your existing infrastructure. We handle everything from planning to deployment.', '/cloud-infrastructure.png', ARRAY['Cloud migration', 'Infrastructure setup', 'DevOps automation', 'Security implementation', 'Cost optimization'], 'Starting at $3,000', false),
      ('service-4', 'AI Integration', 'Integrate cutting-edge AI capabilities into your applications. From chatbots to predictive analytics.', '/artificial-intelligence-integration.jpg', ARRAY['Machine learning models', 'Natural language processing', 'Computer vision', 'Predictive analytics', 'AI consulting'], 'Starting at $10,000', true)
    ON CONFLICT (id) DO NOTHING
  `

  await sql`
    INSERT INTO testimonials (id, name, role, company, content, avatar, rating, featured)
    VALUES 
      ('test-1', 'John Smith', 'CTO', 'TechCorp Inc', 'HatBrain transformed our business with their innovative solutions. Their team delivered beyond our expectations and the results speak for themselves.', '/professional-man.jpg', 5, true),
      ('test-2', 'Maria Garcia', 'Product Manager', 'StartupXYZ', 'Working with HatBrain was a game-changer. They understood our vision and brought it to life with exceptional quality and speed.', '/professional-woman-diverse.png', 5, true),
      ('test-3', 'David Lee', 'CEO', 'InnovateLabs', 'The expertise and professionalism of the HatBrain team is unmatched. They delivered a complex project on time and within budget.', '/business-executive.png', 5, true),
      ('test-4', 'Sophie Anderson', 'Director of Engineering', 'GlobalTech', 'HatBrain''s technical skills and communication made our collaboration seamless. Highly recommend for any software project.', '/tech-professional.png', 5, false)
    ON CONFLICT (id) DO NOTHING
  `

  console.log("[v0] Data seeded successfully!")
}

seedData()
