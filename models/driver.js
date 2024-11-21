const mongoose = require('mongoose');

// Driver Schema
const driverSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true, unique: true },
    is_available: { type: Boolean, default: true },
    driver_status: { type: Boolean, default: true }  // true means active, false means inactive
}, { timestamps: true });  // adds createdAt and updatedAt fields

// Create the Driver model
const Driver = mongoose.model('Driver', driverSchema);

module.exports = Driver;