const Minio = require('minio');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

/**
 * MinIO Client Configuration
 */
const minioClient = new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT || 'localhost',
    port: parseInt(process.env.MINIO_PORT) || 9000,
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
});

const BUCKET_NAME = process.env.MINIO_BUCKET || 'course-videos';

/**
 * Initialize MinIO Bucket
 * Ensure the bucket exists, create if not
 */
async function initializeBucket() {
    try {
        const bucketExists = await minioClient.bucketExists(BUCKET_NAME);
        if (!bucketExists) {
            await minioClient.makeBucket(BUCKET_NAME, 'us-east-1');
            console.log(`Bucket '${BUCKET_NAME}' created successfully.`);

            // Set bucket policy to public read for videos
            const policy = {
                Version: "2012-10-17",
                Statement: [
                    {
                        Action: ["s3:GetObject"],
                        Effect: "Allow",
                        Principal: { AWS: ["*"] },
                        Resource: [`arn:aws:s3:::${BUCKET_NAME}/*`]
                    }
                ]
            };
            await minioClient.setBucketPolicy(BUCKET_NAME, JSON.stringify(policy));
            console.log(`Bucket '${BUCKET_NAME}' policy set to public read.`);
        }
    } catch (error) {
        console.error('Error initializing MinIO bucket:', error);
        // Don't throw error here to allow app to start, but log it
    }
}

// Initialize bucket on startup
initializeBucket();

/**
 * Upload video file to MinIO
 * @param {Object} file - File object from multer
 * @param {string} courseId - Course ID for organization
 * @param {string} subtopicId - Subtopic ID for organization
 * @returns {Promise<string>} Public URL of uploaded file
 */
async function uploadVideo(file, courseId, subtopicId) {
    if (!file) {
        throw new Error('No file provided for upload');
    }

    const fileExtension = path.extname(file.originalname);
    const fileName = `${courseId}/${subtopicId}/${uuidv4()}${fileExtension}`;

    const metaData = {
        'Content-Type': file.mimetype,
        'X-Amz-Meta-Original-Name': file.originalname,
    };

    try {
        await minioClient.putObject(
            BUCKET_NAME,
            fileName,
            file.buffer,
            file.size,
            metaData
        );

        // Construct public URL
        const protocol = process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http';
        const host = process.env.MINIO_ENDPOINT || 'localhost';
        const port = process.env.MINIO_PORT || 9000;

        // If running in docker, might need to use localhost for external access instead of service name
        // ideally uses a configured public URL env var, but fallback to constructing it
        const publicUrl = process.env.MINIO_PUBLIC_URL
            ? `${process.env.MINIO_PUBLIC_URL}/${BUCKET_NAME}/${fileName}`
            : `${protocol}://${host}:${port}/${BUCKET_NAME}/${fileName}`;

        return publicUrl;
    } catch (error) {
        console.error('MinIO upload error:', error);
        throw new Error(`Failed to upload video: ${error.message}`);
    }
}

/**
 * Delete video file from MinIO
 * @param {string} fileUrl - Full URL of the file
 */
async function deleteVideo(fileUrl) {
    if (!fileUrl) return;

    try {
        // Extract object name from URL
        // URL format: http://host:port/bucket-name/object-name
        const urlParts = fileUrl.split(`/${BUCKET_NAME}/`);
        if (urlParts.length !== 2) return;

        const objectName = urlParts[1];
        await minioClient.removeObject(BUCKET_NAME, objectName);
    } catch (error) {
        console.error('MinIO delete error:', error);
        // Log but don't throw, as this is often a cleanup task
    }
}

module.exports = {
    minioClient,
    uploadVideo,
    deleteVideo,
    BUCKET_NAME
};
