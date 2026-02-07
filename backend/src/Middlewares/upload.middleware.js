const multer = require('multer');
const path = require('path');

// Use memory storage to keep file in buffer before uploading to MinIO
const storage = multer.memoryStorage();

// File filter to accept only video files
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        'video/mp4',
        'video/webm',
        'video/ogg',
        'video/quicktime' // mov
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only video files are allowed (mp4, webm, ogg, mov).'), false);
    }
};

// Configure multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 500 * 1024 * 1024, // 500MB limit
    }
});

module.exports = upload;
