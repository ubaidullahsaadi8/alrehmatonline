
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const prisma = new PrismaClient();

async function testCreateUser() {
  try {
    console.log('Testing user creation with all required fields...');
    
    
    const testConnection = await prisma.$queryRaw`SELECT 1 as connection_test`;
    console.log('Database connection successful:', testConnection);
    
    
    const testData = {
      email: `test_${Date.now()}@example.com`,
      password: 'Test123!',
      name: 'Test User',
      userType: 'instructor',
      currency: 'PKR',
      country: 'PK',
      education: 'PhD in Computer Science',
      role: 'instructor'
    };
    
    console.log('Creating user with data:', {
      ...testData,
      password: '[HIDDEN]'
    });
    
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(testData.password, salt);
    
    
    const verificationToken = crypto.randomBytes(32).toString('hex');
    
    
    const user = await prisma.user.create({
      data: {
        name: testData.name,
        email: testData.email,
        password: hashedPassword,
        userType: testData.userType,
        role: testData.role,
        country: testData.country,
        currency: testData.currency,
        education: testData.education,
        verificationToken,
        active: false, 
        is_approved: false, 
        account_status: 'pending' 
      }
    });
    
    console.log('User created successfully:', {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      userType: user.userType,
      accountStatus: user.account_status,
      isApproved: user.is_approved,
      active: user.active,
      country: user.country,
      education: user.education,
      currency: user.currency
    });
    
    console.log('\nTest completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}


testCreateUser();
