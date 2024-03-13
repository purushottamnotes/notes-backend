// transactionController.js
const Transaction = require('../models/transactionModel');

exports.getTransactionsBySeller = async (req, res) => {
    try {
        const transactions = await Transaction.find({ seller: req.user._id });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add other transaction-related functionalities as needed
