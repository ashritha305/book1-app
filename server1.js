// server.js

// Load environment variables
// const dotenv = require('dotenv');
// dotenv.config();

// // Initialize the Express application
// const express = require('express');
// const app = express();

// // Database connection setup (make sure you import connectDB)
// const connectDB = require('./config/db1');
// connectDB(); // Connect to the database

// // Middleware and routes (as set up before in your app)
// // Example: app.use(...) and the imports of routes will be done in separate files.

// const PORT = process.env.PORT || 5000;

// // Server starts listening
// app.listen(PORT, 'localhost', () => {
//     console.log(`Server is running on port ${PORT}`);
// });



const app = require("./app1");
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));