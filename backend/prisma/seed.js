const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seeding...\n');

    // ============================================================================
    // 1️⃣ IDENTITY & AUTHORIZATION DOMAIN
    // ============================================================================

    console.log('📋 Seeding Roles...');
    const roles = await Promise.all([
        prisma.role.upsert({
            where: { code: 'ADMIN' },
            update: {},
            create: {
                code: 'ADMIN',
                name: 'Administrator',
                description: 'Full system access with all permissions',
                isSystemRole: true,
            }
        }),
        prisma.role.upsert({
            where: { code: 'INSTRUCTOR' },
            update: {},
            create: {
                code: 'INSTRUCTOR',
                name: 'Instructor',
                description: 'Can create and manage courses',
                isSystemRole: true,
            }
        }),
        prisma.role.upsert({
            where: { code: 'LEARNER' },
            update: {},
            create: {
                code: 'LEARNER',
                name: 'Learner',
                description: 'Can enroll in and take courses',
                isSystemRole: true,
            }
        })
    ]);
    console.log(`✅ ${roles.length} roles seeded\n`);

    console.log('📋 Seeding Permissions...');
    const permissions = await Promise.all([
        // Course permissions
        prisma.permission.upsert({
            where: { code: 'CREATE_COURSE' },
            update: {},
            create: { code: 'CREATE_COURSE', module: 'COURSE', description: 'Can create new courses' }
        }),
        prisma.permission.upsert({
            where: { code: 'EDIT_COURSE' },
            update: {},
            create: { code: 'EDIT_COURSE', module: 'COURSE', description: 'Can edit existing courses' }
        }),
        prisma.permission.upsert({
            where: { code: 'PUBLISH_COURSE' },
            update: {},
            create: { code: 'PUBLISH_COURSE', module: 'COURSE', description: 'Can publish courses' }
        }),
        prisma.permission.upsert({
            where: { code: 'DELETE_COURSE' },
            update: {},
            create: { code: 'DELETE_COURSE', module: 'COURSE', description: 'Can delete courses' }
        }),
        // Quiz permissions
        prisma.permission.upsert({
            where: { code: 'CREATE_QUIZ' },
            update: {},
            create: { code: 'CREATE_QUIZ', module: 'QUIZ', description: 'Can create quizzes' }
        }),
        prisma.permission.upsert({
            where: { code: 'EDIT_QUIZ' },
            update: {},
            create: { code: 'EDIT_QUIZ', module: 'QUIZ', description: 'Can edit quizzes' }
        }),
        prisma.permission.upsert({
            where: { code: 'VIEW_QUIZ_RESULTS' },
            update: {},
            create: { code: 'VIEW_QUIZ_RESULTS', module: 'QUIZ', description: 'Can view quiz results' }
        }),
        // User permissions
        prisma.permission.upsert({
            where: { code: 'MANAGE_USERS' },
            update: {},
            create: { code: 'MANAGE_USERS', module: 'USER', description: 'Can manage users' }
        }),
        prisma.permission.upsert({
            where: { code: 'ASSIGN_ROLES' },
            update: {},
            create: { code: 'ASSIGN_ROLES', module: 'USER', description: 'Can assign roles to users' }
        }),
        // Reporting permissions
        prisma.permission.upsert({
            where: { code: 'VIEW_REPORTS' },
            update: {},
            create: { code: 'VIEW_REPORTS', module: 'REPORTING', description: 'Can view reports' }
        }),
        prisma.permission.upsert({
            where: { code: 'EXPORT_REPORTS' },
            update: {},
            create: { code: 'EXPORT_REPORTS', module: 'REPORTING', description: 'Can export reports' }
        })
    ]);
    console.log(`✅ ${permissions.length} permissions seeded\n`);

    console.log('📋 Seeding Role-Permission Mappings...');
    // Admin gets all permissions
    const adminRole = roles.find(r => r.code === 'ADMIN');
    const instructorRole = roles.find(r => r.code === 'INSTRUCTOR');
    const learnerRole = roles.find(r => r.code === 'LEARNER');

    await Promise.all(
        permissions.map(perm =>
            prisma.rolePermission.upsert({
                where: {
                    roleId_permissionId: {
                        roleId: adminRole.id,
                        permissionId: perm.id
                    }
                },
                update: {},
                create: { roleId: adminRole.id, permissionId: perm.id }
            })
        )
    );

    // Instructor gets course and quiz permissions
    const instructorPerms = permissions.filter(p =>
        p.module === 'COURSE' || p.module === 'QUIZ'
    );
    await Promise.all(
        instructorPerms.map(perm =>
            prisma.rolePermission.upsert({
                where: {
                    roleId_permissionId: {
                        roleId: instructorRole.id,
                        permissionId: perm.id
                    }
                },
                update: {},
                create: { roleId: instructorRole.id, permissionId: perm.id }
            })
        )
    );
    console.log('✅ Role-permission mappings created\n');

    // ============================================================================
    // 2️⃣ COURSE GOVERNANCE DOMAIN
    // ============================================================================

    console.log('📋 Seeding Course Visibility Types...');
    await Promise.all([
        prisma.courseVisibilityType.upsert({
            where: { code: 'EVERYONE' },
            update: {},
            create: { code: 'EVERYONE', description: 'Visible to everyone, including non-logged-in users' }
        }),
        prisma.courseVisibilityType.upsert({
            where: { code: 'SIGNED_IN' },
            update: {},
            create: { code: 'SIGNED_IN', description: 'Visible only to signed-in users' }
        }),
        prisma.courseVisibilityType.upsert({
            where: { code: 'PRIVATE' },
            update: {},
            create: { code: 'PRIVATE', description: 'Visible only to enrolled users' }
        }),
        prisma.courseVisibilityType.upsert({
            where: { code: 'ORGANIZATION_ONLY' },
            update: {},
            create: { code: 'ORGANIZATION_ONLY', description: 'Visible only to users within the same organization' }
        })
    ]);
    console.log('✅ Course visibility types seeded\n');

    console.log('📋 Seeding Course Access Types...');
    await Promise.all([
        prisma.courseAccessType.upsert({
            where: { code: 'OPEN' },
            update: {},
            create: { code: 'OPEN', requiresPayment: false, requiresInvitation: false, description: 'Anyone can enroll freely' }
        }),
        prisma.courseAccessType.upsert({
            where: { code: 'INVITATION' },
            update: {},
            create: { code: 'INVITATION', requiresPayment: false, requiresInvitation: true, description: 'Requires invitation to enroll' }
        }),
        prisma.courseAccessType.upsert({
            where: { code: 'PAYMENT' },
            update: {},
            create: { code: 'PAYMENT', requiresPayment: true, requiresInvitation: false, description: 'Requires one-time payment' }
        }),
        prisma.courseAccessType.upsert({
            where: { code: 'SUBSCRIPTION' },
            update: {},
            create: { code: 'SUBSCRIPTION', requiresPayment: true, requiresInvitation: false, description: 'Requires active subscription' }
        }),
        prisma.courseAccessType.upsert({
            where: { code: 'LICENSE_BASED' },
            update: {},
            create: { code: 'LICENSE_BASED', requiresPayment: true, requiresInvitation: false, description: 'Requires organization license' }
        })
    ]);
    console.log('✅ Course access types seeded\n');

    console.log('📋 Seeding Course Status Types...');
    await Promise.all([
        prisma.courseStatusType.upsert({
            where: { code: 'DRAFT' },
            update: {},
            create: { code: 'DRAFT', description: 'Course is in draft state' }
        }),
        prisma.courseStatusType.upsert({
            where: { code: 'UNDER_REVIEW' },
            update: {},
            create: { code: 'UNDER_REVIEW', description: 'Course is under review' }
        }),
        prisma.courseStatusType.upsert({
            where: { code: 'PUBLISHED' },
            update: {},
            create: { code: 'PUBLISHED', description: 'Course is published and available' }
        }),
        prisma.courseStatusType.upsert({
            where: { code: 'ARCHIVED' },
            update: {},
            create: { code: 'ARCHIVED', description: 'Course is archived' }
        })
    ]);
    console.log('✅ Course status types seeded\n');

    console.log('📋 Seeding Course Categories...');
    await Promise.all([
        prisma.courseCategory.upsert({
            where: { slug: 'programming' },
            update: {},
            create: { name: 'Programming', slug: 'programming' }
        }),
        prisma.courseCategory.upsert({
            where: { slug: 'data-science' },
            update: {},
            create: { name: 'Data Science', slug: 'data-science' }
        }),
        prisma.courseCategory.upsert({
            where: { slug: 'business' },
            update: {},
            create: { name: 'Business', slug: 'business' }
        }),
        prisma.courseCategory.upsert({
            where: { slug: 'design' },
            update: {},
            create: { name: 'Design', slug: 'design' }
        }),
        prisma.courseCategory.upsert({
            where: { slug: 'marketing' },
            update: {},
            create: { name: 'Marketing', slug: 'marketing' }
        })
    ]);
    console.log('✅ Course categories seeded\n');

    // ============================================================================
    // 3️⃣ CONTENT ENGINE DOMAIN
    // ============================================================================

    console.log('📋 Seeding Lesson Types...');
    await Promise.all([
        prisma.lessonType.upsert({
            where: { code: 'VIDEO' },
            update: {},
            create: { code: 'VIDEO', name: 'Video', hasDuration: true, supportsDownload: true, hasGrading: false }
        }),
        prisma.lessonType.upsert({
            where: { code: 'DOCUMENT' },
            update: {},
            create: { code: 'DOCUMENT', name: 'Document', hasDuration: false, supportsDownload: true, hasGrading: false }
        }),
        prisma.lessonType.upsert({
            where: { code: 'IMAGE' },
            update: {},
            create: { code: 'IMAGE', name: 'Image', hasDuration: false, supportsDownload: true, hasGrading: false }
        }),
        prisma.lessonType.upsert({
            where: { code: 'QUIZ' },
            update: {},
            create: { code: 'QUIZ', name: 'Quiz', hasDuration: false, supportsDownload: false, hasGrading: true }
        }),
        prisma.lessonType.upsert({
            where: { code: 'LIVE' },
            update: {},
            create: { code: 'LIVE', name: 'Live Session', hasDuration: true, supportsDownload: false, hasGrading: false }
        }),
        prisma.lessonType.upsert({
            where: { code: 'ASSIGNMENT' },
            update: {},
            create: { code: 'ASSIGNMENT', name: 'Assignment', hasDuration: false, supportsDownload: false, hasGrading: true }
        }),
        prisma.lessonType.upsert({
            where: { code: 'SCORM' },
            update: {},
            create: { code: 'SCORM', name: 'SCORM Package', hasDuration: false, supportsDownload: false, hasGrading: true }
        })
    ]);
    console.log('✅ Lesson types seeded\n');

    console.log('📋 Seeding Attachment Types...');
    await Promise.all([
        prisma.attachmentType.upsert({
            where: { code: 'FILE' },
            update: {},
            create: { code: 'FILE', name: 'File Upload', description: 'Direct file upload' }
        }),
        prisma.attachmentType.upsert({
            where: { code: 'EXTERNAL_LINK' },
            update: {},
            create: { code: 'EXTERNAL_LINK', name: 'External Link', description: 'Link to external resource' }
        }),
        prisma.attachmentType.upsert({
            where: { code: 'EMBEDDED_RESOURCE' },
            update: {},
            create: { code: 'EMBEDDED_RESOURCE', name: 'Embedded Resource', description: 'Embedded resource (iframe, etc.)' }
        })
    ]);
    console.log('✅ Attachment types seeded\n');

    console.log('📋 Seeding Media Providers...');
    await Promise.all([
        prisma.mediaProvider.upsert({
            where: { name: 'YOUTUBE' },
            update: {},
            create: { name: 'YOUTUBE', embedSupported: true }
        }),
        prisma.mediaProvider.upsert({
            where: { name: 'VIMEO' },
            update: {},
            create: { name: 'VIMEO', embedSupported: true }
        }),
        prisma.mediaProvider.upsert({
            where: { name: 'AWS_S3' },
            update: {},
            create: { name: 'AWS_S3', embedSupported: false }
        }),
        prisma.mediaProvider.upsert({
            where: { name: 'GOOGLE_DRIVE' },
            update: {},
            create: { name: 'GOOGLE_DRIVE', embedSupported: true }
        })
    ]);
    console.log('✅ Media providers seeded\n');

    // ============================================================================
    // 4️⃣ ACCESS & ENROLLMENT ENGINE DOMAIN
    // ============================================================================

    console.log('📋 Seeding Enrollment Status Types...');
    await Promise.all([
        prisma.enrollmentStatusType.upsert({
            where: { code: 'INVITED' },
            update: {},
            create: { code: 'INVITED', description: 'User has been invited but not enrolled yet' }
        }),
        prisma.enrollmentStatusType.upsert({
            where: { code: 'ENROLLED' },
            update: {},
            create: { code: 'ENROLLED', description: 'User is enrolled but has not started' }
        }),
        prisma.enrollmentStatusType.upsert({
            where: { code: 'STARTED' },
            update: {},
            create: { code: 'STARTED', description: 'User has started the course' }
        }),
        prisma.enrollmentStatusType.upsert({
            where: { code: 'COMPLETED' },
            update: {},
            create: { code: 'COMPLETED', description: 'User has completed the course' }
        }),
        prisma.enrollmentStatusType.upsert({
            where: { code: 'DROPPED' },
            update: {},
            create: { code: 'DROPPED', description: 'User has dropped the course' }
        })
    ]);
    console.log('✅ Enrollment status types seeded\n');

    console.log('📋 Seeding Progress Status Types...');
    await Promise.all([
        prisma.progressStatusType.upsert({
            where: { code: 'NOT_STARTED' },
            update: {},
            create: { code: 'NOT_STARTED', description: 'Not started yet' }
        }),
        prisma.progressStatusType.upsert({
            where: { code: 'IN_PROGRESS' },
            update: {},
            create: { code: 'IN_PROGRESS', description: 'Currently in progress' }
        }),
        prisma.progressStatusType.upsert({
            where: { code: 'COMPLETED' },
            update: {},
            create: { code: 'COMPLETED', description: 'Completed' }
        })
    ]);
    console.log('✅ Progress status types seeded\n');

    console.log('📋 Seeding Payment Status Types...');
    await Promise.all([
        prisma.paymentStatusType.upsert({
            where: { code: 'PENDING' },
            update: {},
            create: { code: 'PENDING', description: 'Payment is pending' }
        }),
        prisma.paymentStatusType.upsert({
            where: { code: 'SUCCESS' },
            update: {},
            create: { code: 'SUCCESS', description: 'Payment successful' }
        }),
        prisma.paymentStatusType.upsert({
            where: { code: 'FAILED' },
            update: {},
            create: { code: 'FAILED', description: 'Payment failed' }
        }),
        prisma.paymentStatusType.upsert({
            where: { code: 'REFUNDED' },
            update: {},
            create: { code: 'REFUNDED', description: 'Payment refunded' }
        })
    ]);
    console.log('✅ Payment status types seeded\n');

    console.log('📋 Seeding Access Duration Types...');
    await Promise.all([
        prisma.accessDurationType.upsert({
            where: { code: 'LIFETIME' },
            update: {},
            create: { code: 'LIFETIME', description: 'Lifetime access' }
        }),
        prisma.accessDurationType.upsert({
            where: { code: 'FIXED_DAYS' },
            update: {},
            create: { code: 'FIXED_DAYS', description: 'Access for a fixed number of days' }
        }),
        prisma.accessDurationType.upsert({
            where: { code: 'DATE_RANGE' },
            update: {},
            create: { code: 'DATE_RANGE', description: 'Access within a specific date range' }
        })
    ]);
    console.log('✅ Access duration types seeded\n');

    // ============================================================================
    // 5️⃣ QUIZ & ASSESSMENT ENGINE DOMAIN
    // ============================================================================

    console.log('📋 Seeding Question Types...');
    await Promise.all([
        prisma.questionType.upsert({
            where: { code: 'SINGLE_CHOICE' },
            update: {},
            create: { code: 'SINGLE_CHOICE', name: 'Single Choice', autoEvaluated: true, description: 'Select one correct answer' }
        }),
        prisma.questionType.upsert({
            where: { code: 'MULTIPLE_CHOICE' },
            update: {},
            create: { code: 'MULTIPLE_CHOICE', name: 'Multiple Choice', autoEvaluated: true, description: 'Select multiple correct answers' }
        }),
        prisma.questionType.upsert({
            where: { code: 'TRUE_FALSE' },
            update: {},
            create: { code: 'TRUE_FALSE', name: 'True/False', autoEvaluated: true, description: 'True or False question' }
        }),
        prisma.questionType.upsert({
            where: { code: 'TEXT' },
            update: {},
            create: { code: 'TEXT', name: 'Text Answer', autoEvaluated: false, description: 'Free text answer requiring manual grading' }
        }),
        prisma.questionType.upsert({
            where: { code: 'MATCHING' },
            update: {},
            create: { code: 'MATCHING', name: 'Matching', autoEvaluated: true, description: 'Match items from two lists' }
        })
    ]);
    console.log('✅ Question types seeded\n');

    console.log('📋 Seeding Default Attempt Reward Policies...');
    await Promise.all([
        prisma.attemptRewardPolicy.upsert({
            where: { id: '00000000-0000-0000-0000-000000000001' },
            update: {},
            create: { id: '00000000-0000-0000-0000-000000000001', quizId: null, attemptFrom: 1, attemptTo: 1, points: 10 }
        }),
        prisma.attemptRewardPolicy.upsert({
            where: { id: '00000000-0000-0000-0000-000000000002' },
            update: {},
            create: { id: '00000000-0000-0000-0000-000000000002', quizId: null, attemptFrom: 2, attemptTo: 2, points: 7 }
        }),
        prisma.attemptRewardPolicy.upsert({
            where: { id: '00000000-0000-0000-0000-000000000003' },
            update: {},
            create: { id: '00000000-0000-0000-0000-000000000003', quizId: null, attemptFrom: 3, attemptTo: 3, points: 5 }
        }),
        prisma.attemptRewardPolicy.upsert({
            where: { id: '00000000-0000-0000-0000-000000000004' },
            update: {},
            create: { id: '00000000-0000-0000-0000-000000000004', quizId: null, attemptFrom: 4, attemptTo: null, points: 2 }
        })
    ]);
    console.log('✅ Default attempt reward policies seeded\n');

    console.log('📋 Seeding Grading Policies...');
    await Promise.all([
        prisma.gradingPolicy.upsert({
            where: { id: '00000000-0000-0000-0000-000000000001' },
            update: {},
            create: {
                id: '00000000-0000-0000-0000-000000000001',
                name: 'Standard Grading',
                passPercentage: 60,
                maxAttempts: null,
                allowRetryImmediately: true,
                description: 'Standard 60% pass rate with unlimited attempts'
            }
        }),
        prisma.gradingPolicy.upsert({
            where: { id: '00000000-0000-0000-0000-000000000002' },
            update: {},
            create: {
                id: '00000000-0000-0000-0000-000000000002',
                name: 'Strict Grading',
                passPercentage: 80,
                maxAttempts: 3,
                allowRetryImmediately: false,
                description: 'Strict 80% pass rate with 3 attempts maximum'
            }
        })
    ]);
    console.log('✅ Grading policies seeded\n');

    // ============================================================================
    // 6️⃣ GAMIFICATION ENGINE DOMAIN
    // ============================================================================

    console.log('📋 Seeding Badge Types...');
    await Promise.all([
        prisma.badgeType.upsert({
            where: { name: 'Bronze' },
            update: {},
            create: { name: 'Bronze', minPoints: 0, maxPoints: 99, levelOrder: 1, description: 'Bronze level badge' }
        }),
        prisma.badgeType.upsert({
            where: { name: 'Silver' },
            update: {},
            create: { name: 'Silver', minPoints: 100, maxPoints: 299, levelOrder: 2, description: 'Silver level badge' }
        }),
        prisma.badgeType.upsert({
            where: { name: 'Gold' },
            update: {},
            create: { name: 'Gold', minPoints: 300, maxPoints: 599, levelOrder: 3, description: 'Gold level badge' }
        }),
        prisma.badgeType.upsert({
            where: { name: 'Platinum' },
            update: {},
            create: { name: 'Platinum', minPoints: 600, maxPoints: 999, levelOrder: 4, description: 'Platinum level badge' }
        }),
        prisma.badgeType.upsert({
            where: { name: 'Diamond' },
            update: {},
            create: { name: 'Diamond', minPoints: 1000, maxPoints: null, levelOrder: 5, description: 'Diamond level badge' }
        })
    ]);
    console.log('✅ Badge types seeded\n');

    console.log('📋 Seeding Point Sources...');
    await Promise.all([
        prisma.pointSource.upsert({
            where: { code: 'QUIZ_COMPLETION' },
            update: {},
            create: { code: 'QUIZ_COMPLETION', name: 'Quiz Completion', description: 'Points earned by completing quizzes' }
        }),
        prisma.pointSource.upsert({
            where: { code: 'COURSE_COMPLETION' },
            update: {},
            create: { code: 'COURSE_COMPLETION', name: 'Course Completion', description: 'Points earned by completing courses' }
        }),
        prisma.pointSource.upsert({
            where: { code: 'BONUS' },
            update: {},
            create: { code: 'BONUS', name: 'Bonus Points', description: 'Bonus points awarded' }
        }),
        prisma.pointSource.upsert({
            where: { code: 'ADMIN_GRANT' },
            update: {},
            create: { code: 'ADMIN_GRANT', name: 'Admin Grant', description: 'Points granted by administrator' }
        }),
        prisma.pointSource.upsert({
            where: { code: 'ADMIN_DEDUCT' },
            update: {},
            create: { code: 'ADMIN_DEDUCT', name: 'Admin Deduct', description: 'Points deducted by administrator' }
        }),
        prisma.pointSource.upsert({
            where: { code: 'REFERRAL' },
            update: {},
            create: { code: 'REFERRAL', name: 'Referral Bonus', description: 'Points earned through referrals' }
        }),
        prisma.pointSource.upsert({
            where: { code: 'EVENT' },
            update: {},
            create: { code: 'EVENT', name: 'Event Participation', description: 'Points earned by participating in events' }
        })
    ]);
    console.log('✅ Point sources seeded\n');

    console.log('📋 Seeding Achievement Rules...');
    await Promise.all([
        prisma.achievementRule.upsert({
            where: { id: '00000000-0000-0000-0000-000000000001' },
            update: {},
            create: {
                id: '00000000-0000-0000-0000-000000000001',
                name: 'First 100 Points',
                ruleType: 'POINT_BASED',
                thresholdValue: 100,
                rewardPoints: 50,
                description: 'Achieve 100 total points'
            }
        }),
        prisma.achievementRule.upsert({
            where: { id: '00000000-0000-0000-0000-000000000002' },
            update: {},
            create: {
                id: '00000000-0000-0000-0000-000000000002',
                name: 'Complete 5 Courses',
                ruleType: 'COURSE_COUNT',
                thresholdValue: 5,
                rewardPoints: 100,
                description: 'Complete 5 courses'
            }
        }),
        prisma.achievementRule.upsert({
            where: { id: '00000000-0000-0000-0000-000000000003' },
            update: {},
            create: {
                id: '00000000-0000-0000-0000-000000000003',
                name: 'Perfect Quiz Score',
                ruleType: 'QUIZ_PERFECT_SCORE',
                thresholdValue: 100,
                rewardPoints: 25,
                description: 'Achieve 100% on any quiz'
            }
        })
    ]);
    console.log('✅ Achievement rules seeded\n');

    // ============================================================================
    // 7️⃣ REVIEW & FEEDBACK ENGINE DOMAIN
    // ============================================================================

    console.log('📋 Seeding Rating Scales...');
    await Promise.all([
        prisma.ratingScale.upsert({
            where: { value: 1 },
            update: {},
            create: { value: 1, description: 'Poor' }
        }),
        prisma.ratingScale.upsert({
            where: { value: 2 },
            update: {},
            create: { value: 2, description: 'Fair' }
        }),
        prisma.ratingScale.upsert({
            where: { value: 3 },
            update: {},
            create: { value: 3, description: 'Good' }
        }),
        prisma.ratingScale.upsert({
            where: { value: 4 },
            update: {},
            create: { value: 4, description: 'Very Good' }
        }),
        prisma.ratingScale.upsert({
            where: { value: 5 },
            update: {},
            create: { value: 5, description: 'Excellent' }
        })
    ]);
    console.log('✅ Rating scales seeded\n');

    console.log('📋 Seeding Review Status Types...');
    await Promise.all([
        prisma.reviewStatusType.upsert({
            where: { code: 'PENDING_APPROVAL' },
            update: {},
            create: { code: 'PENDING_APPROVAL', description: 'Review is pending approval' }
        }),
        prisma.reviewStatusType.upsert({
            where: { code: 'APPROVED' },
            update: {},
            create: { code: 'APPROVED', description: 'Review is approved and visible' }
        }),
        prisma.reviewStatusType.upsert({
            where: { code: 'REJECTED' },
            update: {},
            create: { code: 'REJECTED', description: 'Review is rejected' }
        })
    ]);
    console.log('✅ Review status types seeded\n');

    // ============================================================================
    // 8️⃣ REPORTING & ANALYTICS ENGINE DOMAIN
    // ============================================================================

    console.log('📋 Seeding Report Types...');
    await Promise.all([
        prisma.reportType.upsert({
            where: { code: 'COURSE_PROGRESS' },
            update: {},
            create: { code: 'COURSE_PROGRESS', name: 'Course Progress Report', description: 'Track student progress in courses' }
        }),
        prisma.reportType.upsert({
            where: { code: 'QUIZ_ANALYTICS' },
            update: {},
            create: { code: 'QUIZ_ANALYTICS', name: 'Quiz Analytics Report', description: 'Analyze quiz performance and statistics' }
        }),
        prisma.reportType.upsert({
            where: { code: 'USER_PERFORMANCE' },
            update: {},
            create: { code: 'USER_PERFORMANCE', name: 'User Performance Report', description: 'Track overall user performance' }
        })
    ]);
    console.log('✅ Report types seeded\n');

    console.log('📋 Seeding Time Granularity Types...');
    await Promise.all([
        prisma.timeGranularityType.upsert({
            where: { code: 'DAILY' },
            update: {},
            create: { code: 'DAILY', description: 'Daily aggregation' }
        }),
        prisma.timeGranularityType.upsert({
            where: { code: 'WEEKLY' },
            update: {},
            create: { code: 'WEEKLY', description: 'Weekly aggregation' }
        }),
        prisma.timeGranularityType.upsert({
            where: { code: 'MONTHLY' },
            update: {},
            create: { code: 'MONTHLY', description: 'Monthly aggregation' }
        }),
        prisma.timeGranularityType.upsert({
            where: { code: 'YEARLY' },
            update: {},
            create: { code: 'YEARLY', description: 'Yearly aggregation' }
        })
    ]);
    console.log('✅ Time granularity types seeded\n');

    // ============================================================================
    // 9️⃣ SYSTEM CONFIGURATION LAYER
    // ============================================================================

    console.log('📋 Seeding System Settings...');
    await Promise.all([
        prisma.systemSetting.upsert({
            where: { key: 'DEFAULT_PASS_PERCENTAGE' },
            update: {},
            create: { key: 'DEFAULT_PASS_PERCENTAGE', value: '60', dataType: 'NUMBER', module: 'QUIZ', description: 'Default passing percentage for quizzes' }
        }),
        prisma.systemSetting.upsert({
            where: { key: 'MAX_UPLOAD_SIZE_MB' },
            update: {},
            create: { key: 'MAX_UPLOAD_SIZE_MB', value: '100', dataType: 'NUMBER', module: 'UPLOAD', description: 'Maximum file upload size in megabytes' }
        }),
        prisma.systemSetting.upsert({
            where: { key: 'DEFAULT_VIDEO_COMPLETION_PERCENT' },
            update: {},
            create: { key: 'DEFAULT_VIDEO_COMPLETION_PERCENT', value: '90', dataType: 'NUMBER', module: 'VIDEO', description: 'Percentage of video to watch to mark as completed' }
        }),
        prisma.systemSetting.upsert({
            where: { key: 'ENABLE_GAMIFICATION' },
            update: {},
            create: { key: 'ENABLE_GAMIFICATION', value: 'true', dataType: 'BOOLEAN', module: 'GAMIFICATION', description: 'Enable gamification features' }
        }),
        prisma.systemSetting.upsert({
            where: { key: 'ENABLE_REVIEW_MODERATION' },
            update: {},
            create: { key: 'ENABLE_REVIEW_MODERATION', value: 'false', dataType: 'BOOLEAN', module: 'REVIEW', description: 'Enable review moderation before publishing' }
        }),
        prisma.systemSetting.upsert({
            where: { key: 'COURSE_ENROLLMENT_NOTIFICATION' },
            update: {},
            create: { key: 'COURSE_ENROLLMENT_NOTIFICATION', value: 'true', dataType: 'BOOLEAN', module: 'COURSE', description: 'Send notifications on course enrollment' }
        }),
        prisma.systemSetting.upsert({
            where: { key: 'PAYMENT_ENABLED' },
            update: {},
            create: { key: 'PAYMENT_ENABLED', value: 'true', dataType: 'BOOLEAN', module: 'PAYMENT', description: 'Enable payment functionality on the platform' }
        })
    ]);
    console.log('✅ System settings seeded\n');

    console.log('\n🎉 Database seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Error during seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
