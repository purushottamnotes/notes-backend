// noteController.js
const Note = require("../models/noteModel");
const Payment = require("../models/razorpayModel");

exports.createNote = async (req, res) => {
  console.log(req.user);
  try {
    const { title, content, price, category, images } = req.body;
    const newNote = new Note({
      title,
      content,
      price,
      category,
      images,
      seller: req.user.userId,
    });
    await newNote.save();
    res
      .status(201)
      .json({ message: "Note created successfully", note: newNote });
  } catch (error) {
    res.status(500).json({ message: error.message });
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