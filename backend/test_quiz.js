console.log('Booting script...');
require('dotenv').config();
const { prisma } = require('./src/Prisma/client');
const courseService = require('./src/Services/course.service');

async function testQuizImplementation() {
    console.log('Starting Quiz Implementation Test...');

    // 1. Setup Wrapper for Mock Request/Response/User
    const instructor = await prisma.user.findFirst({
        where: { role: { code: 'INSTRUCTOR' } }
    });

    if (!instructor) {
        console.error('No instructor found. Please seed the database.');
        return;
    }

    console.log(`Using instructor: ${instructor.email}`);

    // 2. Create Course Data with Questions
    const courseData = {
        title: `Quiz Test Course ${Date.now()}`,
        slug: `quiz-test-course-${Date.now()}`,
        description: 'A course to test quiz questions',
        topics: [
            {
                title: 'Topic 1',
                description: 'First topic',
                subtopics: [
                    {
                        title: 'Subtopic 1 with Quiz',
                        description: 'This subtopic has a quiz',
                        questions: [
                            {
                                questionText: 'What is 2 + 2?',
                                questionTypeId: 'SINGLE_CHOICE', // Assuming this is valid or ignored if optional
                                options: ['3', '4', '5', '6'],
                                correctAnswer: '4',
                                points: 5
                            },
                            {
                                questionText: 'Is the sky blue?',
                                questionTypeId: 'TRUE_FALSE',
                                options: ['True', 'False'],
                                correctAnswer: 'True',
                                points: 2
                            }
                        ]
                    }
                ]
            }
        ]
    };

    try {
        // 3. Call Service to Create Course
        console.log('Creating course...');
        const createdCourse = await courseService.createCourse(courseData, instructor);
        console.log(`Course created with ID: ${createdCourse.id}`);

        // 4. Verify Creation Response
        const subtopic = createdCourse.topics[0].subtopics[0];
        // Note: createCourse might not return questions in its immediate response depending on inclusion, 
        // but we updated getMyCourses and getCourseById.
        // Let's check getCourseById

        console.log('Fetching course by ID...');
        const fetchedCourse = await courseService.getCourseById(createdCourse.id, instructor.id);

        const fetchedSubtopic = fetchedCourse.topics[0].subtopics[0];
        console.log('Fetched Subtopic:', JSON.stringify(fetchedSubtopic, null, 2));

        if (fetchedSubtopic.questions && fetchedSubtopic.questions.length === 2) {
            console.log('✅ SUCCESS: Questions were created and retrieved successfully.');
            console.log('Question 1:', fetchedSubtopic.questions[0].questionText);
            console.log('Question 2:', fetchedSubtopic.questions[1].questionText);
        } else {
            console.error('❌ FAILURE: Questions were not found in the fetched course.');
        }

        // Cleanup
        console.log('Cleaning up...');
        await prisma.course.delete({ where: { id: createdCourse.id } });
        console.log('Test course deleted.');

    } catch (error) {
        console.error('Test Failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testQuizImplementation();
