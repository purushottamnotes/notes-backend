// notesRoutes.js
const express = require("express");
const { createNote, getNoteById, approveNotes, notesboughtbyuser } = require("../controller/notes.controller");
const { signup, login } = require("../controller/profile.controller");
const { getTransactionsBySeller } = require("../controller/trasaction.controller");
const { getAllUsers } = require("../controller/user.controller");
const { authenticateToken } = require("../middleware/auth.middleware");
const { capturePayment, createOrder, payment } = require("../controller/razorpay");
const noteModel = require("../models/noteModel");
const multer = require("multer");
const path = require('path');
const router = express.Router();
const fs = require('fs');

router.post('/signup', signup);
router.post('/login', login);
router.get('/notesBySeller', authenticateToken, getNoteById);
router.get('/transactions/seller', authenticateToken, getTransactionsBySeller);
router.get('/users', authenticateToken, getAllUsers);
router.post('/approve-notes', approveNotes);
router.post('/create-order', createOrder);
router.post('/capture-payment', capturePayment)
router.post('/completePayment', authenticateToken, payment)
router.get('/notesboughtbyuser', authenticateToken, notesboughtbyuser)
router.get('/notes', async (req, res) => {
  try {
    const notes = await noteModel.find().select({ imagePath: 0 }); // Retrieve all notes from the database
    res.json(notes); // Send the notes as a JSON response
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
