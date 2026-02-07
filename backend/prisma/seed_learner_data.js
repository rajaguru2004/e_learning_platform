require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting learner data seeding for guru2@gmail.com...\n');

    // 1. Ensure Roles exist
    const learnerRole = await prisma.role.upsert({
        where: { code: 'LEARNER' },
        update: {},
        create: {
            code: 'LEARNER',
            name: 'Learner',
            description: 'Can enroll in and take courses',
            isSystemRole: true,
        }
    });

    const instructorRole = await prisma.role.upsert({
        where: { code: 'INSTRUCTOR' },
        update: {},
        create: {
            code: 'INSTRUCTOR',
            name: 'Instructor',
            description: 'Can create and manage courses',
            isSystemRole: true,
        }
    });

    // 2. Create an Instructor
    const hashedPassword = await bcrypt.hash('password123', 10);
    const instructor = await prisma.user.upsert({
        where: { email: 'instructor@example.com' },
        update: {},
        create: {
            name: 'Dr. Jane Smith',
            email: 'instructor@example.com',
            password: hashedPassword,
            roleId: instructorRole.id,
        }
    });

    // 3. Create Categories if they don't exist
    const categories = await Promise.all([
        prisma.courseCategory.upsert({
            where: { slug: 'design' },
            update: {},
            create: { name: 'Design', slug: 'design' }
        }),
        prisma.courseCategory.upsert({
            where: { slug: 'programming' },
            update: {},
            create: { name: 'Programming', slug: 'programming' }
        }),
        prisma.courseCategory.upsert({
            where: { slug: 'business' },
            update: {},
            create: { name: 'Business', slug: 'business' }
        })
    ]);

    // 4. Create 5 Sample Courses
    const courseData = [
        {
            title: 'Advanced UI Design Masterclass',
            slug: 'advanced-ui-design',
            description: 'Master the art of creating stunning user interfaces with this comprehensive guide.',
            price: 199.99,
            categoryId: categories[0].id,
            duration: 1200,
            averageRating: 4.8,
            totalReviews: 156,
            enrollmentCount: 1250,
        },
        {
            title: 'React & Node.js: Full Stack Development',
            slug: 'fullstack-react-node',
            description: 'Build modern, scalable web applications from scratch using the MERN stack.',
            price: 149.50,
            categoryId: categories[1].id,
            duration: 2400,
            averageRating: 4.6,
            totalReviews: 89,
            enrollmentCount: 450,
        },
        {
            title: 'Digital Marketing Strategies 2024',
            slug: 'digital-marketing-2024',
            description: 'Learn latest marketing trends, SEO, and social media advertising strategies.',
            price: 79.00,
            categoryId: categories[2].id,
            duration: 900,
            averageRating: 4.2,
            totalReviews: 45,
            enrollmentCount: 200,
        },
        {
            title: 'Python for Data Science & AI',
            slug: 'python-data-science',
            description: 'Start your journey into AI and Data Science using Python and its powerful libraries.',
            price: 0,
            categoryId: categories[1].id,
            duration: 1800,
            averageRating: 4.9,
            totalReviews: 320,
            enrollmentCount: 5600,
        },
        {
            title: 'UX Case Study Mastery',
            slug: 'ux-case-study',
            description: 'Learn how to build compelling UX case studies that get you hired.',
            price: 59.99,
            categoryId: categories[0].id,
            duration: 600,
            averageRating: 4.5,
            totalReviews: 28,
            enrollmentCount: 120,
        }
    ];

    const courses = [];
    for (const data of courseData) {
        const course = await prisma.course.upsert({
            where: { slug: data.slug },
            update: data,
            create: {
                ...data,
                instructorId: instructor.id,
                statusCode: 'PUBLISHED',
                visibilityCode: 'EVERYONE',
                accessCode: data.price > 0 ? 'PAYMENT' : 'OPEN',
            }
        });
        courses.push(course);
    }
    console.log(`✅ ${courses.length} courses seeded/updated`);

    // 5. Create the Learner User: guru2@gmail.com
    const learnerPassword = await bcrypt.hash('guru123', 10);
    const learner = await prisma.user.upsert({
        where: { email: 'guru2@gmail.com' },
        update: {
            name: 'Guru Learner',
        },
        create: {
            name: 'Guru Learner',
            email: 'guru2@gmail.com',
            password: learnerPassword,
            roleId: learnerRole.id,
        }
    });
    console.log(`✅ Learner user guru2@gmail.com created/updated`);

    // 6. Create Enrollments
    const enrollmentStatuses = ['COMPLETED', 'STARTED', 'ENROLLED', 'COMPLETED', 'STARTED'];
    const percentages = [100, 45, 0, 100, 15];

    for (let i = 0; i < courses.length; i++) {
        const status = enrollmentStatuses[i];
        const progress = percentages[i];

        await prisma.enrollment.upsert({
            where: {
                userId_courseId: {
                    userId: learner.id,
                    courseId: courses[i].id
                }
            },
            update: {
                statusCode: status,
                progressPercent: progress,
                completedAt: status === 'COMPLETED' ? new Date() : null,
            },
            create: {
                userId: learner.id,
                courseId: courses[i].id,
                statusCode: status,
                progressPercent: progress,
                completedAt: status === 'COMPLETED' ? new Date() : null,
            }
        });
    }
    console.log(`✅ ${courses.length} enrollments created for guru2@gmail.com`);

    // 7. Seed Points Ledger for Gamification
    const pointEntries = [
        { code: 'COURSE_COMPLETION', points: 150, description: 'Completed Advanced UI Design' },
        { code: 'COURSE_COMPLETION', points: 100, description: 'Completed Python for Data Science' },
        { code: 'QUIZ_COMPLETION', points: 50, description: 'Highest score in Intro Quiz' },
        { code: 'BONUS', points: 25, description: 'Daily login bonus' },
        { code: 'BONUS', points: 25, description: 'Profile completion' }
    ];

    // Clear existing ledger for this user to avoid duplicates if re-running
    await prisma.pointsLedger.deleteMany({
        where: { userId: learner.id }
    });

    for (const entry of pointEntries) {
        await prisma.pointsLedger.create({
            data: {
                userId: learner.id,
                sourceCode: entry.code,
                points: entry.points,
                description: entry.description,
            }
        });
    }
    console.log(`✅ Points ledger seeded (Total: 350 points)`);

    console.log('\n🎉 Learner seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Error during seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
