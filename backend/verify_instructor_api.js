const { prisma } = require('./src/Prisma/client');
const instructorService = require('./src/Services/instructor.service');
const authService = require('./src/Services/auth.service');
const courseService = require('./src/Services/course.service');

async function verify() {
    console.log('🧪 Starting Instructor API Verification...\n');

    try {
        // 1. Create a test instructor
        const instructorEmail = `instructor_test_${Date.now()}@example.com`;
        const instructor = await authService.register({
            name: 'Test Instructor',
            email: instructorEmail,
            password: 'password123',
            role: 'INSTRUCTOR'
        });
        console.log('✅ Instructor created:', instructor.email);

        // 2. Create a test course for this instructor
        const course = await courseService.createCourse({
            title: 'Test Course for API Verification',
            slug: `test-course-${Date.now()}`,
            description: 'Verification course',
            price: 50.00
        }, instructor);
        console.log('✅ Course created:', course.title);

        // 3. Create a test student and enroll them
        const studentEmail = `student_test_${Date.now()}@example.com`;
        const student = await authService.register({
            name: 'Test Student',
            email: studentEmail,
            password: 'password123'
        });
        console.log('✅ Student created:', student.email);

        // Enroll student manually using prisma (to simulate enrollment)
        const enrollment = await prisma.enrollment.create({
            data: {
                userId: student.id,
                courseId: course.id,
                statusCode: 'ENROLLED'
            }
        });
        console.log('✅ Student enrolled in course');

        // 4. Create a successful payment for this enrollment
        const payment = await prisma.payment.create({
            data: {
                userId: student.id,
                courseId: course.id,
                amount: 50.00,
                statusCode: 'SUCCESS',
                paymentGateway: 'TEST'
            }
        });
        console.log('✅ Payment recorded for course');

        // 5. Verify the instructor enrollment stats service
        console.log('\n🔍 Fetching Instructor Enrollment Stats...');
        const stats = await instructorService.getInstructorEnrollmentStats(instructor.id);

        console.log('📊 Stats Result:');
        console.log(JSON.stringify(stats, null, 2));

        // Assertions
        if (stats.summary.total_courses !== 1) throw new Error('Expected 1 total course');
        if (stats.summary.total_students !== 1) throw new Error('Expected 1 total student');
        if (parseFloat(stats.summary.total_revenue) !== 50.00) throw new Error('Expected 50.00 total revenue');
        if (stats.courses[0].student_count !== 1) throw new Error('Course student count mismatch');
        if (parseFloat(stats.courses[0].revenue) !== 50.00) throw new Error('Course revenue mismatch');

        console.log('\n🎉 Verification successful! Instructor API logic is working correctly.');

    } catch (error) {
        console.error('❌ Verification failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

verify();
