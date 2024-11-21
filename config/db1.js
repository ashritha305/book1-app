 const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const url = process.env.MONGO_URI; // Database URL from .env
        await mongoose.connect(url);  // No need for useNewUrlParser and useUnifiedTopology anymore

        console.log('MongoDB connection established.');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1); // Exit process with failure code if connection fails
    }
};

// MongoDB connection event listeners
mongoose.connection.on('disconnected', () => {
    console.log('MongoDB connection closed.');
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

module.exports = connectDB;
