import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"


export async function POST(req: NextRequest) {
  try {
    
    const user = await getSession()
    
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 401 })
    }

    const results = {
      courses: {
        created: 0,
        errors: 0
      },
      services: {
        created: 0,
        errors: 0
      }
    };

    
    const sampleCourses = [
      {
        id: `course_${Date.now()}_1`,
        title: "Web Development Fundamentals",
        description: "Learn HTML, CSS, and JavaScript basics to build modern websites.",
        image: "/web-development-coding.png",
        price: 299.99,
        duration: "8 weeks",
        level: "Beginner",
        instructor: "John Smith",
        category: "Web Development",
        featured: true
      },
      {
        id: `course_${Date.now()}_2`,
        title: "Advanced React Development",
        description: "Master React.js and build complex, interactive web applications.",
        image: "/placeholder.jpg",
        price: 499.99,
        duration: "10 weeks",
        level: "Intermediate",
        instructor: "Sarah Johnson",
        category: "Frontend Development",
        featured: false
      },
      {
        id: `course_${Date.now()}_3`,
        title: "Mobile App Development with Flutter",
        description: "Create cross-platform mobile applications using Flutter framework.",
        image: "/mobile-app-development.png",
        price: 599.99,
        duration: "12 weeks",
        level: "Advanced",
        instructor: "Michael Chen",
        category: "Mobile Development",
        featured: true
      }
    ];

    
    const sampleServices = [
      {
        id: `service_${Date.now()}_1`,
        title: "Custom Software Development",
        description: "End-to-end custom software development tailored to your business needs.",
        image: "/custom-software-development.png",
        features: [
          "Requirements analysis",
          "Custom development",
          "Testing & QA",
          "Deployment & maintenance"
        ],
        price: "$5,000 - $25,000",
        featured: true
      },
      {
        id: `service_${Date.now()}_2`,
        title: "Mobile App Development",
        description: "Native and cross-platform mobile applications for iOS and Android.",
        image: "/mobile-app-design-concept.png",
        features: [
          "UI/UX design",
          "Native development",
          "API integration",
          "App store submission"
        ],
        price: "$8,000 - $30,000",
        featured: true
      },
      {
        id: `service_${Date.now()}_3`,
        title: "Cloud Infrastructure Setup",
        description: "Secure, scalable cloud infrastructure solutions for your business.",
        image: "/cloud-computing-architecture.png",
        features: [
          "Cloud architecture design",
          "Migration services",
          "Security hardening",
          "Ongoing maintenance"
        ],
        price: "$3,000 - $15,000",
        featured: false
      }
    ];

    
    for (const course of sampleCourses) {
      try {
        await sql`
          INSERT INTO courses (
            id, 
            title, 
            description, 
            image, 
            price,
            duration,
            level,
            instructor,
            category,
            featured
          ) VALUES (
            ${course.id},
            ${course.title},
            ${course.description},
            ${course.image},
            ${course.price},
            ${course.duration},
            ${course.level},
            ${course.instructor},
            ${course.category},
            ${course.featured}
          )
          ON CONFLICT (id) DO NOTHING
        `;
        results.courses.created++;
      } catch (error) {
        console.error("Error creating sample course:", error);
        results.courses.errors++;
      }
    }

    // Create sample services
    for (const service of sampleServices) {
      try {
        await sql`
          INSERT INTO services (
            id, 
            title, 
            description, 
            image, 
            features, 
            price, 
            featured
          ) VALUES (
            ${service.id},
            ${service.title},
            ${service.description},
            ${service.image},
            ${service.features},
            ${service.price},
            ${service.featured}
          )
          ON CONFLICT (id) DO NOTHING
        `;
        results.services.created++;
      } catch (error) {
        console.error("Error creating sample service:", error);
        results.services.errors++;
      }
    }

    return NextResponse.json({
      success: true,
      message: "Sample data created successfully",
      results
    });
  } catch (error) {
    console.error("Error creating sample data:", error);
    return NextResponse.json(
      { error: "Failed to create sample data", details: String(error) },
      { status: 500 }
    );
  }
}
