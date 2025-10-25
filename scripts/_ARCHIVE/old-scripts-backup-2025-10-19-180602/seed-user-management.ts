import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding user management data...');

  try {
    
    const adminExists = await prisma.users.findFirst({
      where: {
        email: 'admin@example.com',
        role: 'admin',
      },
    });

    if (!adminExists) {
      
      await prisma.users.create({
        data: {
          id: 'admin-' + Date.now().toString(),
          email: 'admin@example.com',
          password: await bcrypt.hash('admin123', 10),
          name: 'Admin User',
          role: 'admin',
        },
      });
      console.log('✅ Admin user created');
    } else {
      console.log('✅ Admin user already exists');
    }

    
    const userEmails = ['user1@example.com', 'user2@example.com', 'user3@example.com'];
    
    for (const email of userEmails) {
      const userExists = await prisma.users.findUnique({
        where: { email },
      });

      if (!userExists) {
        await prisma.users.create({
          data: {
            id: 'user-' + Date.now().toString() + Math.floor(Math.random() * 1000),
            email,
            password: await bcrypt.hash('password123', 10),
            name: 'Sample User ' + email.split('@')[0],
            phone: '+1234567890',
            whatsapp: '+1234567890',
            telegram: '@user' + email.split('@')[0],
            secondary_email: 'secondary.' + email,
          },
        });
        console.log(`✅ User created: ${email}`);
      } else {
        console.log(`✅ User already exists: ${email}`);
      }
    }

    
    const courses = await prisma.courses.findMany();
    const users = await prisma.users.findMany({
      where: {
        role: 'user',
      },
    });

    if (courses.length > 0 && users.length > 0) {
      
      for (let i = 0; i < Math.min(users.length, courses.length); i++) {
        const existingEnrollment = await prisma.student_courses.findFirst({
          where: {
            user_id: users[i].id,
            course_id: courses[i].id,
          },
        });

        if (!existingEnrollment) {
          const totalFee = parseFloat(courses[i].price.toString());
          const paidAmount = totalFee * 0.5; 
          
          const enrollment = await prisma.student_courses.create({
            data: {
              user_id: users[i].id,
              course_id: courses[i].id,
              status: ['pending', 'active', 'completed'][Math.floor(Math.random() * 3)],
              total_fee: totalFee,
              paid_amount: paidAmount,
              due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 
            },
          });

          
          await prisma.course_payments.create({
            data: {
              user_course_id: enrollment.id,
              amount: paidAmount,
              payment_method: 'cash',
              reference: 'PAYMENT-' + Date.now(),
              notes: 'Initial payment',
              created_by: 'admin-system',
            },
          });

          console.log(`✅ Course enrollment created: ${users[i].email} -> ${courses[i].title}`);
        } else {
          console.log(`✅ Course enrollment already exists: ${users[i].email} -> ${courses[i].title}`);
        }
      }
    }

    
    const services = await prisma.services.findMany();

    if (services.length > 0 && users.length > 0) {
      
      for (let i = 0; i < Math.min(users.length, services.length); i++) {
        const existingEnrollment = await prisma.user_services.findFirst({
          where: {
            user_id: users[i].id,
            service_id: services[i].id,
          },
        });

        if (!existingEnrollment) {
          const totalFee = parseFloat(services[i].price.replace(/[^0-9.]/g, ''));
          const paidAmount = totalFee * 0.3; // 30% paid
          
          const enrollment = await prisma.user_services.create({
            data: {
              user_id: users[i].id,
              service_id: services[i].id,
              status: ['pending', 'active', 'completed'][Math.floor(Math.random() * 3)],
              total_fee: totalFee,
              paid_amount: paidAmount,
              due_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), 
            },
          });

          
          await prisma.service_payments.create({
            data: {
              user_service_id: enrollment.id,
              amount: paidAmount,
              payment_method: 'bank',
              reference: 'SRV-PAYMENT-' + Date.now(),
              notes: 'Initial payment',
              created_by: 'admin-system',
            },
          });

          console.log(`✅ Service enrollment created: ${users[i].email} -> ${services[i].title}`);
        } else {
          console.log(`✅ Service enrollment already exists: ${users[i].email} -> ${services[i].title}`);
        }
      }
    }

    
    for (const user of users) {
      const notificationTypes = ['info', 'warning', 'success'];
      const notificationCount = await prisma.notifications.count({
        where: {
          user_id: user.id,
        },
      });

      if (notificationCount < 3) {
        await prisma.notifications.createMany({
          data: [
            {
              user_id: user.id,
              title: 'Welcome to our platform',
              message: 'Thank you for joining our platform. We hope you enjoy our services!',
              type: 'success',
              created_by: 'admin-system',
            },
            {
              user_id: user.id,
              title: 'Complete your profile',
              message: 'Please complete your profile by adding your contact information.',
              type: 'info',
              created_by: 'admin-system',
              link: '/profile',
            },
            {
              user_id: user.id,
              title: 'Payment reminder',
              message: 'You have pending payments. Please check your enrollments.',
              type: 'warning',
              created_by: 'admin-system',
            },
          ],
        });
        console.log(`✅ Notifications created for user: ${user.email}`);
      } else {
        console.log(`✅ Notifications already exist for user: ${user.email}`);
      }
    }

    console.log('✅ Seeding completed successfully');
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
