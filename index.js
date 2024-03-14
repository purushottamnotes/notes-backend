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

// app.js
const AWS = require('aws-sdk');

// Configure AWS SDK
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});


const storage = multer.memoryStorage(); // Use memory storage since we're uploading directly to S3

const upload = multer({ storage: storage });

connectDB();
// Middleware setup
app.use(express.json());
app.use(cors())
// Routes setup
app.use("/api", router);

app.post('/api/notes', upload.single('images'), async (req, res) => {
  try {
    const file = req.file;

    // Upload file to S3 bucket
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${Date.now()}-${file.originalname}`, // Set a unique key for the file
      Body: file.buffer, // Use file buffer as the Body
      // ACL: 'public-read', // Set ACL to public-read if needed
    };

    const uploadedFile = await s3.upload(params).promise();

    // Create a new Note instance with data from the request body
    const newNote = new noteModel({
      title: req.body.title,
      content: req.body.content,
      price: req.body.price,
      category: req.body.category,
      imagePath: uploadedFile.Location, // Get the S3 file URL
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
