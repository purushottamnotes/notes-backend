// app.js
const express = require("express");
const { connectDB } = require("./db");
const app = express();
const router = require("./routes/routes");
require("dotenv").config();
const cors = require('cors')
connectDB();
// Middleware setup
app.use(express.json());
const corsOpts = {
  origin: '*',

  methods: [
    'GET',
    'POST',
  ],

  allowedHeaders: [
    'Content-Type',
  ],
};

app.use(cors(corsOpts));

// Routes setup
app.use("/api", router);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
