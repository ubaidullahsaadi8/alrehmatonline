import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

const sampleCourses = [
  {
    id: `course_${randomUUID()}`,
    title: 'Introduction to Web Development',
    description: 'Learn the basics of HTML, CSS, and JavaScript',
    image: '/courses/web-dev.jpg',
    price: 299.99,
    duration: '8 weeks',
    level: 'Beginner',
    instructor: null,
    category: 'Web Development',
    featured: true
  },
  {
    id: `course_${randomUUID()}`,
    title: 'Advanced JavaScript Programming',
    description: 'Master modern JavaScript concepts and frameworks',
    image: '/courses/javascript.jpg',
    price: 399.99,
    duration: '10 weeks',
    level: 'Advanced',
    instructor: null,
    category: 'Programming',
    featured: false
  },
  {
    id: `course_${randomUUID()}`,
    title: 'Python for Data Science',
    description: 'Learn Python programming for data analysis',
    image: '/courses/python.jpg',
    price: 449.99,
    duration: '12 weeks',
    level: 'Intermediate',
    instructor: null,
    category: 'Data Science',
    featured: true
  }
];

async function createSampleCourses() {
  try {
    console.log('Creating sample courses...');

    for (const course of sampleCourses) {
      await prisma.courses.create({
        data: course
      });
      console.log(`Created course: ${course.title}`);
    }

    console.log('Sample courses created successfully!');
  } catch (error) {
    console.error('Error creating sample courses:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSampleCourses();