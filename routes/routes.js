// notesRoutes.js
const express = require("express");
const { createNote, getNoteById, approveNotes, notesboughtbyuser, getNotes, previewWeb } = require("../controller/notes.controller");
const { signup, login } = require("../controller/profile.controller");
const { getTransactionsBySeller } = require("../controller/trasaction.controller");
const { getAllUsers } = require("../controller/user.controller");
const { authenticateToken } = require("../middleware/auth.middleware");
const { capturePayment, createOrder, payment, addRating } = require("../controller/razorpay");
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
router.post('/payment/:paymentId/rating', authenticateToken, addRating)
router.get('/notes', getNotes);

module.exports = router;
