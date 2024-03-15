// razorpay.js
const Razorpay = require('razorpay');
const Payment = require('../models/razorpayModel');
const noteModel = require('../models/noteModel');
const Rating = require('../models/ratingSchema');

const razorpay = new Razorpay({
  key_id: 'rzp_test_YvvpgmgWRVnUlF',
  key_secret: '4qkw19EMVa7Crs5DRXVMYDdi',
});

exports.createOrder = async (req, res) => {
  const options = {
    amount: 50000, // amount in the smallest currency unit (e.g., paisa)
    currency: 'INR',
    receipt: 'order_rcptid_11',
    payment_capture: 1,
  };

  try {
    const response = await razorpay.orders.create(options);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.capturePayment = async (req, res) => {
  const { orderId, paymentId, signature } = req.body;

  try {
    const response = await razorpay.payments.capture(paymentId, amount, currency, signature);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.payment = async (req, res) => {
  console.log(req.user, req.body, "checkoayemnsfkadj");
  // Extract user details from req.user
  try {
    // Parse the incoming data
    const { note, paymentResponse } = req.body; // Change to noteId
    const { userId } = req.user;

    // Find the note associated with the provided noteId
    const noteBought = await noteModel.findById(note._id);

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    // Create a new payment document using the Payment model
    const payment = new Payment({
      userId,
      note: noteBought, // Associate the note with the payment
      paymentResponse
    });

    // Save the payment document to the database
    await payment.save();

    res.status(201).json({ message: 'Payment data stored successfully' });
  } catch (error) {
    console.error('Error storing payment data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// API to add a rating to a payment
exports.addRating = async (req, res) => {
  const { paymentId } = req.params;
  const { userId, ratingValue } = req.body;

  try {
    // Find the payment and check if the user has bought the note
    const payment = await Payment.findOne({ _id: paymentId, userId: userId });
    console.log(paymentId, userId, req.body);

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found for the user' });
    }

    // Check if the user has already added a rating for this payment
    let rating = await Rating.findOne({ paymentId, userId });

    if (!rating) {
      // Create a new Rating document
      rating = new Rating({
        paymentId: payment._id,
        userId,
        rating: ratingValue,
        productId: payment.note._id
      });
    } else {
      // Update the existing rating
      rating.rating = ratingValue;
    }
    const result = await Payment.findByIdAndUpdate(payment._id, { rating: ratingValue })
    console.log(result)
    // Save or update the rating
    await rating.save();

    res.status(200).json({ message: 'Rating added or updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error });
  }
}