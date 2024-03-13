const multer = require('multer');
const upload = multer({ 
  dest: 'uploads/', // Specify the directory where uploaded files will be stored
  fileFilter: function (req, file, cb) {
    
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed'));
    }
    cb(null, true);
  }
}); 

// Define multer middleware for handling file uploads
const uploadMiddleware = upload.array('images', 5);

module.exports = uploadMiddleware; // Export the middleware
