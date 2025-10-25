import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sampleUnassignedCourses = [
  {
    id: 'course-react-2024',
    title: 'Modern React Development 2024',
    description: 'Master React 18 with Hooks, Context, and Modern Best Practices',
    image: '/placeholder.jpg',
    price: 299.99,
    duration: '8 weeks',
    level: 'Intermediate',
    instructor: '',
    category: 'Web Development',
    featured: true
  },
  {
    id: 'course-node-advanced',
    title: 'Advanced Node.js Development',
    description: 'Build scalable and performant server applications',
    image: '/placeholder.jpg',
    price: 399.99,
    duration: '10 weeks',
    level: 'Advanced',
    instructor: '',
    category: 'Backend Development',
    featured: false
  },
  {
    id: 'course-ai-ml',
    title: 'AI and Machine Learning Fundamentals',
    description: 'Introduction to AI concepts and practical ML applications',
    image: '/placeholder.jpg',
    price: 499.99,
    duration: '12 weeks',
    level: 'Beginner',
    instructor: '',
    category: 'AI & ML',
    featured: true
  }
];

async function createUnassignedCourses() {
  try {
    console.log('Creating unassigned courses...');

    for (const course of sampleUnassignedCourses) {
      const created = await prisma.courses.create({
        data: course
      });
      console.log(`Created course: ${created.title}`);
    }

    console.log('Unassigned courses created successfully!');
  } catch (error) {
    console.error('Error creating unassigned courses:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createUnassignedCourses();