import { sql } from "@/lib/db";


export async function seedCourses() {
  try {
    console.log("Starting to seed courses...");
    
    
    const courses = [
      {
        id: `course_${Date.now()}_1`,
        title: "Web Development Fundamentals",
        description: "Learn HTML, CSS, and JavaScript basics to build modern websites from scratch. This course covers all the essentials to get you started as a web developer.",
        image: "/web-development-coding.png",
        price: 29999, 
        duration: "8 weeks",
        level: "Beginner",
        instructor: "John Smith",
        category: "Web Development",
        featured: true
      },
      {
        id: `course_${Date.now()}_2`,
        title: "Advanced React Development",
        description: "Master React.js and build complex, interactive web applications. Learn hooks, context API, Redux, and more to create professional-level applications.",
        image: "/placeholder.jpg",
        price: 49999, 
        duration: "10 weeks",
        level: "Intermediate",
        instructor: "Sarah Johnson",
        category: "Frontend Development",
        featured: false
      },
      {
        id: `course_${Date.now()}_3`,
        title: "Mobile App Development with Flutter",
        description: "Create cross-platform mobile applications using Flutter framework. Build beautiful, natively compiled applications for mobile, web, and desktop from a single codebase.",
        image: "/mobile-app-development.png",
        price: 59999, 
        duration: "12 weeks",
        level: "Advanced",
        instructor: "Michael Chen",
        category: "Mobile Development",
        featured: true
      }
    ];

    
    for (const course of courses) {
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
      console.log(`Added course: ${course.title}`);
    }

    console.log("Courses seeded successfully!");
    return { success: true, count: courses.length };
  } catch (error) {
    console.error("Error seeding courses:", error);
    return { success: false, error };
  }
}

// Function to create sample services
export async function seedServices() {
  try {
    console.log("Starting to seed services...");
    
    // Sample services
    const services = [
      {
        id: `service_${Date.now()}_1`,
        title: "Custom Software Development",
        description: "End-to-end custom software development tailored to your business needs. Our team of experts will work with you to create scalable and efficient solutions.",
        image: "/custom-software-development.png",
        features: [
          "Requirements analysis",
          "Custom development",
          "Testing & QA",
          "Deployment & maintenance"
        ],
        price: "Starting at PKR 500,000",
        featured: true
      },
      {
        id: `service_${Date.now()}_2`,
        title: "Mobile App Development",
        description: "Native and cross-platform mobile applications for iOS and Android. Create engaging mobile experiences that users will love.",
        image: "/mobile-app-design-concept.png",
        features: [
          "UI/UX design",
          "Native development",
          "API integration",
          "App store submission"
        ],
        price: "Starting at PKR 800,000",
        featured: true
      },
      {
        id: `service_${Date.now()}_3`,
        title: "Cloud Infrastructure Setup",
        description: "Secure, scalable cloud infrastructure solutions for your business. Optimize your operations with our cloud expertise.",
        image: "/cloud-computing-architecture.png",
        features: [
          "Cloud architecture design",
          "Migration services",
          "Security hardening",
          "Ongoing maintenance"
        ],
        price: "Starting at PKR 300,000",
        featured: false
      }
    ];

    
    for (const service of services) {
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
      console.log(`Added service: ${service.title}`);
    }

    console.log("Services seeded successfully!");
    return { success: true, count: services.length };
  } catch (error) {
    console.error("Error seeding services:", error);
    return { success: false, error };
  }
}


export async function seedAll() {
  const coursesResult = await seedCourses();
  const servicesResult = await seedServices();
  
  return {
    courses: coursesResult,
    services: servicesResult
  };
}
