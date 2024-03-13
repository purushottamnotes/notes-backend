const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    note: { type: Object, required: true },
    paymentResponse: { type: String, required: true }
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
