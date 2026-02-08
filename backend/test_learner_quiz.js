require('dotenv').config();
const { prisma } = require('./src/Prisma/client');
const courseService = require('./src/Services/course.service');
const learnerService = require('./src/Services/learner.service');

async function testLearnerQuizImplementation() {
    console.log('Starting Learner Quiz Implementation Test...');

    // 1. Setup Wrapper for Mock Request/Response/User
    const instructor = await prisma.user.findFirst({
        where: { role: { code: 'INSTRUCTOR' } }
    });

    if (!instructor) {
        console.error('No instructor found. Please seed the database.');
        return;
    }

    // 2. Create Course Data with Questions
    const courseData = {
        title: `Learner Quiz Test Course ${Date.now()}`,
        slug: `learner-quiz-test-course-${Date.now()}`,
        description: 'A course to test quiz questions for learners',
        topics: [
            {
                title: 'Topic 1',
                subtopics: [
                    {
                        title: 'Subtopic 1 with Quiz',
                        questions: [
                            {
                                questionText: 'Learner Check 1',
                                questionTypeId: 'SINGLE_CHOICE',
                                options: ['A', 'B'],
                                correctAnswer: 'A',
                                points: 5
                            }
                        ]
                    }
                ]
            }
        ]
    };

    let courseId;

    try {
        // 3. Create Course
        console.log('Creating course...');
        const createdCourse = await courseService.createCourse(courseData, instructor);
        courseId = createdCourse.id;

        // 4. Publish Course (Learner API only shows published courses)
        console.log('Publishing course...');
        // Manually update status to PUBLISHED for testing
        await prisma.course.update({
            where: { id: courseId },
            data: {
                statusCode: 'PUBLISHED',
                isActive: true
            }
        });

        // 5. Test getAllCourses
        console.log('Testing learnerService.getAllCourses...');
        const allCourses = await learnerService.getAllCourses({ search: courseData.title });
        const courseFromList = allCourses.courses.find(c => c.id === courseId);

        if (courseFromList) {
            const hasQuestions = courseFromList.topics[0]?.subtopics[0]?.questions?.length > 0;
            console.log(`getAllCourses: Questions present? ${hasQuestions}`);
            if (!hasQuestions) console.log('❌ getAllCourses FAILED to return questions');
            else console.log('✅ getAllCourses returned questions');
        } else {
            console.error('❌ Course not found in getAllCourses');
        }

        // 6. Test getCourseDetails
        console.log('Testing learnerService.getCourseDetails...');
        const courseDetails = await learnerService.getCourseDetails(courseId);

        if (courseDetails) {
            const hasQuestionsDetails = courseDetails.topics[0]?.subtopics[0]?.questions?.length > 0;
            console.log(`getCourseDetails: Questions present? ${hasQuestionsDetails}`);
            if (!hasQuestionsDetails) console.log('❌ getCourseDetails FAILED to return questions');
            else console.log('✅ getCourseDetails returned questions');
        }

    } catch (error) {
        console.error('Test Failed:', error);
    } finally {
        if (courseId) {
            console.log('Cleaning up...');
            await prisma.course.delete({ where: { id: courseId } });
        }
        await prisma.$disconnect();
    }
}

testLearnerQuizImplementation();
