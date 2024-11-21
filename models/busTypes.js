const mongoose = require('mongoose');

// Define the schema for Bus Type
const busTypeSchema = new mongoose.Schema({
  bus_type_name: { 
    type: String, 
    required: true,  // Ensure bus_type_name is always provided
    unique: true,  // Ensure each bus type name is unique
  },
  amenities: { 
    type: [String],  // Store amenities as an array of strings
    required: true, // Amenities must be provided
    default: []  // Default to an empty array if no amenities are provided
  }
}, { timestamps: true }); // Automatically include createdAt and updatedAt fields

// Create the BusType model based on the schema
const BusType = mongoose.model('BusType', busTypeSchema);

module.exports = BusType;
