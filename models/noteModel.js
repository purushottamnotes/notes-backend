// models/Note.js
const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: false,
  },
  content: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    required: false,
  },
  category: {
    type: String,
    required: false,
  },
  imagePath: {
    type: String,
    required: false,
  },
  thumbnailPath: { // Adding thumbnail path field
    type: String,
    required: false,
  },
  seller: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: [0, 1, 2],
    default: 2,
  }
});

module.exports = mongoose.model("Note", noteSchema);
