const mongoose = require('mongoose');

// Define the passenger details schema
const passengerDetailSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  seat_number: {
    type: Number,
    required: true
  }
});

// Define the booking schema
const bookingSchema = new mongoose.Schema({
  busId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus',
    required: true,
  },
  routeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route', // Reference to the Route model
    required: true,
  },
  bookedSeats: { // Array to store the booked seat numbers
    type: [Number],
    required: true,
  },
  passengerDetails: { // Array of passenger details
    type: [passengerDetailSchema], // Array of objects based on passengerDetailSchema
    required: true,
  },
  userId: { // Reference to the Users model
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users', // Reference to the Users model
    required: true,
  },
  totalFare:{
    type:Number,
    required:true,
  },
  bookingDate: { // Date and time of the booking
    type: Date,
    default: Date.now,
  },
  status: { // Booking status (Confirmed or Cancelled)
    type: String,
    enum: ['Confirmed', 'Cancelled'],
    default: 'Confirmed',
  },
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
