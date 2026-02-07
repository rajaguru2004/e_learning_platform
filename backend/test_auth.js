const { PrismaClient } = require('@prisma/client');
console.log('Loading auth service...');
const authService = require('./src/Services/auth.service');
console.log('Auth service loaded.');

const prisma = new PrismaClient();

async function main() {
    console.log('🧪 Testing Authentication Flow...\n');

    const testEmail = `test_${Date.now()}@example.com`;
    const testPassword = 'password123';

    try {
        // 1. Test Registration (Learner)
        console.log('1️⃣ Testing Registration (Default/Learner)...');
        const learner = await authService.register({
            name: 'Test Learner',
            email: testEmail,
            password: testPassword
        });
        console.log('✅ Learner registered:', learner.name, learner.email);
        console.log('   Role:', learner.role.code);

        if (learner.role.code !== 'LEARNER') throw new Error('Default role should be LEARNER');

        // 2. Test Login
        console.log('\n2️⃣ Testing Login...');
        const loginResult = await authService.login(testEmail, testPassword);
        console.log('✅ Login successful');
        console.log('   Token generated:', !!loginResult.token);
        console.log('   User Role:', loginResult.user.role.code);

        // 3. Test Registration (Instructor)
        console.log('\n3️⃣ Testing Registration (Instructor)...');
        const instructorEmail = `instructor_${Date.now()}@example.com`;
        const instructor = await authService.register({
            name: 'Test Instructor',
            email: instructorEmail,
            password: testPassword,
            role: 'INSTRUCTOR' // Case insensitive check
        });
        console.log('✅ Instructor registered:', instructor.name);
        console.log('   Role:', instructor.role.code);

        if (instructor.role.code !== 'INSTRUCTOR') throw new Error('Role should be INSTRUCTOR');

        console.log('\n🎉 Authentication flow verified successfully!');

    } catch (error) {
        console.error('❌ Error during auth test:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
