const multer = require('multer');
const path = require('path');

// Setup for file uploads using multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');  // Define the folder where files will be saved
    },
    filename: (req, file, cb) => {
        // Generate a unique filename based on the current time and the original file name
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// Create the upload middleware using multer
const upload = multer({ storage: storage });

module.exports = upload;
