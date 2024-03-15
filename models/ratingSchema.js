const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    paymentId: { type: String, required: true },
    userId: { type: String, required: true },
    rating: { type: Number, required: true, min: 0, max: 5 },
    productId: { type: String }
});

const Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating;
