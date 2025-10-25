const { PrismaClient } = require('@prisma/client');
const { hashPassword, getUserByEmail } = require('../lib/auth');

const prisma = new PrismaClient();

async function testUserCreation() {
  try {
    console.log('Testing user creation with all fields...');
    
    const testEmail = 'test_user_' + Math.floor(Math.random() * 10000) + '@example.com';
    const hashedPassword = await hashPassword('password123');
    const id = crypto.randomUUID();
    
    const userData = {
      id,
      email: testEmail,
      password: hashedPassword,
      name: 'Test User',
      username: 'testuser' + Math.floor(Math.random() * 10000),
      user_type: 'student',
      account_status: 'active',
      is_approved: true,
      active: true,
      country: 'US',
      currency: 'USD',
      education: 'Bachelor degree in Computer Science'
    };
    
    
    const result = await prisma.$queryRaw`
      INSERT INTO users (
        id, email, password, name, username, user_type, account_status, 
        is_approved, active, country, currency, education, created_at, updated_at
      ) VALUES (
        ${userData.id}, ${userData.email}, ${userData.password}, ${userData.name}, 
        ${userData.username}, ${userData.user_type}, ${userData.account_status},
        ${userData.is_approved}, ${userData.active}, ${userData.country}, 
        ${userData.currency}, ${userData.education}, NOW(), NOW()
      )
      RETURNING id, email, name, username, user_type, account_status, country, currency
    `;
    
    console.log('User created successfully:', result[0]);
    
    
    const user = await getUserByEmail(testEmail);
    if (user) {
      console.log('Successfully retrieved user with getUserByEmail:', {
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username,
        user_type: user.user_type,
        country: user.country,
        currency: user.currency
      });
    } else {
      console.error('Failed to retrieve user with getUserByEmail');
    }
    
    console.log('Test completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testUserCreation();
