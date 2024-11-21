

const mongoose = require('mongoose');
const Stop = require('./stops'); // Import the Stop model
const Bus = require('./bus'); // Import the Bus model

// Define the Route schema
const routeSchema = new mongoose.Schema({
  starting_stop_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Stop', // Reference to the Stop model
  },
  ending_stop_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Stop', // Reference to the Stop model
  },
  duration: {
    type: String, // Duration in minutes (or another unit)
    required: true,
  },
  distance: {
    type: String, // Distance in kilometers (or another unit)
    required: true,
  },
  bus_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Bus', // Reference to the Bus model
  },
  fare: {
    type: Number, // Fare as a numeric value (could be in your currency)
    required: true,
    min: [0, 'Fare must be a positive value'], // Ensure fare is a positive number
  },
});

// Create and export the Route model
const Route = mongoose.model('Route', routeSchema);

module.exports = Route;


