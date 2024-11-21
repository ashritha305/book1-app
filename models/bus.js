




const mongoose = require('mongoose');

// Define the Seat schema
const seatSchema = new mongoose.Schema({
  seat_number: {
    type: Number,
    required: true,
  },
  seat_status: {
    type: String, // e.g., 'available', 'booked', etc.
    enum: ['available', 'booked'],
    default: 'available',
  },
});

// Define the Bus schema
const busSchema = new mongoose.Schema({
  bus_number: {
    type: String, // Assuming bus number is a string
    required: true,
  },
  arrival_time: {
    type: Date, // Store as a Date object
    required: true,
  },
  bus_type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BusType', // Reference to the BusType model
    required: true, // A bus must have a bus type
  },
  isAvailable: {
    type: Boolean,
    default: true, // Default value is true
  },
  no_of_seats: {
    type: Number, // Number of seats
    required: true,
  },
  seats: {
    type: [seatSchema], // Array of seat objects
    default: [],
  },
  available_seats: {
    type: Number, // Number of remaining available seats
    default: function() {
      return this.no_of_seats; // Default value is the same as no_of_seats
    },
  },
  remaining_seats: {
    type: Number, // Number of seats remaining for booking
    default: function() {
      return this.available_seats; // Default value is set to available_seats
    },
  },
  bus_status: {
    type: Boolean,
    default: true, // Default value is 'active'
  },
  driver_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver', // Reference to the Driver model
    required: true, // A bus must have an assigned driver
  },
});

// Method to book seats
busSchema.methods.bookSeats = async function (selectedSeats) {
  // Loop through the selected seats and update their status to 'booked'
  this.seats.forEach(seat => {
    if (selectedSeats.includes(seat.seat_number)) {
      seat.seat_status = 'booked'; // Change seat status to 'booked'
    }
  });

  // Decrease the remaining seats based on the number of booked seats
  this.remaining_seats -= selectedSeats.length;

  // Save the updated bus document
  await this.save();
};

// Pre-save hook to generate seats when a new bus is created
busSchema.pre('save', function (next) {
  if (this.isNew && this.no_of_seats) { // Only create seats if this is a new document
    this.seats = Array.from({ length: this.no_of_seats }, (_, index) => ({
      seat_number: index + 1,
      seat_status: 'available',
    }));
  }

  next();
});

// Create and export the Bus model
const Bus = mongoose.model('Bus', busSchema);
module.exports = Bus;







