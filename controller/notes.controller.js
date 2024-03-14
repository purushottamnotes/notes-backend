// noteController.js
const Note = require("../models/noteModel");
const Payment = require("../models/razorpayModel");
const multer = require('multer');


exports.createNote = async (req, res) => {
  try {
    const { title, content, price, category } = req.body;
    console.log(req); // Log uploaded files to check if they are present

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files were uploaded.' });
    }

    const images = req.files.map(file => file.filename);

    const newNote = new Note({
      title,
      content,
      price,
      category,
      images,
      seller: req.user.userId,
    });

    await newNote.save();

    res.status(201).json({ message: 'Note created successfully', note: newNote });
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};


exports.getNoteById = async (req, res) => {
  try {
    const note = await Note.find({ seller: req.user.userId });
    console.log(req.user);
    if (!note.length) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add other CRUD operations for notes (updateNote, deleteNote)
exports.approveNotes = async (req, res) => {
  console.log(req.body)
  try {
    // Update notes with status 0 to status 1 (approved)
    await Note.findByIdAndUpdate(req.body.noteId, { status: req.body.status });
    res.status(200).json({ message: "Notes updated successfully" });
  } catch (error) {
    console.error("Error approving notes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.notesboughtbyuser = async (req, res) => {
  try {
    // Extract userId from req.user
    const { userId } = req.user;

    // Query Payment collection to find payments associated with the given userId
    const payments = await Payment.find({ userId });
    // Return the notes bought by the user as a response
    res.status(200).json(payments);
  } catch (error) {
    console.error('Error fetching notes bought by user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.preview=async(req,res)=>{
  try {
    // Replace 'YOUR_BUCKET_NAME' and 'example.pdf' with your S3 bucket and file name
    const params = {
      Bucket: 'YOUR_BUCKET_NAME',
      Key: 'example.pdf'
    };

    const { Body } = await s3.getObject(params).promise();
    const pdfDoc = await PDFDocument.load(Body);
    const pageCount = pdfDoc.getPageCount();

    // Generate random page numbers
    const pageNumbers = [];
    while (pageNumbers.length < 2) {
      const pageNum = Math.floor(Math.random() * pageCount) + 1;
      if (!pageNumbers.includes(pageNum)) {
        pageNumbers.push(pageNum);
      }
    }

    // Extract selected pages
    const previewDoc = await PDFDocument.create();
    for (const pageNum of pageNumbers) {
      const [copiedPage] = await previewDoc.copyPages(pdfDoc, [pageNum - 1]);
      previewDoc.addPage(copiedPage);
    }

    // Serialize preview document
    const previewBytes = await previewDoc.save();
    res.contentType('application/pdf');
    res.send(previewBytes);
  } catch (error) {
    console.error('Error generating preview:', error);
    res.status(500).send('Internal Server Error');
  }
}
const AWS = require('aws-sdk');
const noteModel = require("../models/noteModel");

// Configure AWS
const { PDFDocument } = require('pdf-lib');
const { URL } = require('url'); // Import the URL module

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'ap-south-1'
});

const s3 = new AWS.S3();

exports.getNotes = async (req, res) => {
  try {
    const notes = await noteModel.find().select({ imagePath: 0 });
    
    res.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function to extract key from URL
function extractKeyFromUrl(url) {
  const parsedUrl = new URL(url);
  const pathSegments = parsedUrl.pathname.split('/');
  return pathSegments[pathSegments.length - 1];
}
