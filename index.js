// app.js
const express = require("express");
const { connectDB } = require("./db");
const app = express();
const router = require("./routes/routes");
require("dotenv").config();
const cors = require('cors')
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { createNote } = require("./controller/notes.controller");
const { authenticateToken } = require("./middleware/auth.middleware");
const noteModel = require("./models/noteModel");


const uploadDir = path.join(__dirname, 'uploads');

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = '.pdf'; // Set the desired extension
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});
const upload = multer({ storage: storage })



connectDB();
// Middleware setup
app.use(express.json());
app.use(cors())
// Routes setup
app.use("/api", router);

app.post('/api/notes', upload.single('images'), async (req, res) => 
{
    console.log(req);
    try {
      // Create a new Note instance with data from the request body
      const newNote = new noteModel({
        title: req.body.title,
        content: req.body.content,
        price: req.body.price,
        category: req.body.category,
        imagePath: req.file.path // Assuming multer provides the path of the uploaded file in req.file.path
      });
  
      // Save the new note to the database
      await newNote.save();
  
      res.status(201).json({ message: 'Note created successfully', note: newNote });
    } catch (error) {
      console.error('Error creating note:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
