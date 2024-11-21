// controllers/busController.js

const Bus = require('../models/bus'); // Bus model
const BusType = require('../models/busTypes'); // BusType model
const Driver = require('../models/driver'); // Driver model

// Fetch all buses with bus_status: true, populated bus_type and driver details
exports.getActiveBuses = async (req, res) => {
    console.log("inside get bus..");
    
    try {
      const buses = await Bus.find({ bus_status: true })  // Filter buses where bus_status is true
        .populate('bus_type', 'bus_type_name')  // Populate bus_type details
        .populate('driver_id', 'name email mobile')  // Populate driver details
        .exec();
  
      if (!buses || buses.length === 0) {
        return res.status(404).json({ message: 'No active buses found' });
      }
  
      res.status(200).json(buses);
    } catch (error) {
      console.error('Error fetching active buses:', error);
      res.status(500).json({ message: 'Error fetching active buses' });
    }
  };

// Create a new bus
exports.createBus = async (req, res) => {
    console.log("entered bus post..");
  
    const { bus_number, arrival_time, no_of_seats, driver_id, bus_type } = req.body;
    console.log("arrival_time:"+arrival_time);
    
  
    try {
      // Check if bus_type and driver_id are valid
      const busType = await BusType.findById(bus_type);
      const driver = await Driver.findById(driver_id);
  
      if (!busType) return res.status(400).json({ message: 'Invalid Bus Type' });
      if (!driver) return res.status(400).json({ message: 'Invalid Driver' });
  
      const bus = new Bus({
        bus_number,
        arrival_time: new Date(arrival_time),
        no_of_seats,
        driver_id, // Reference to the Driver model
        bus_type: busType._id, // Reference to BusType
      });
  
      console.log("bus:"+bus);
      
  
      await bus.save();
      res.status(201).json(bus);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

// Update a bus by ID
exports.updateBus =  async (req, res) => {
    const { bus_number, arrival_time, no_of_seats, isAvailable, bus_type, driver_id } = req.body;
  
    try {
      // Check if bus_type and driver_id are valid
      const busType = await BusType.findById(bus_type);
      const driver = await Driver.findById(driver_id);
  
      if (!busType) return res.status(400).json({ message: 'Invalid Bus Type' });
      if (!driver) return res.status(400).json({ message: 'Invalid Driver' });
  
      const updateData = {
        bus_number,
        arrival_time: new Date(arrival_time),
        no_of_seats,
        isAvailable,
        bus_type: busType._id, // Reference to BusType
        driver_id: driver._id, // Reference to Driver
      };
  
      const updatedBus = await Bus.findByIdAndUpdate(req.params.id, updateData, { new: true })
        .populate('driver_id', 'name email mobile')
        .populate('bus_type', 'bus_type_name');
  
      if (!updatedBus) {
        return res.status(404).json({ message: 'Bus not found' });
      }
  
      res.status(200).json(updatedBus);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };


// Update bus availability to false after adding it to route
exports.updateBusAvailability =  async (req, res) => {
  console.log(req.params.busId);
  

  console.log("inside patch..");
  console.log("kkkkk");
  
  
  const { busId } = req.params;
  
  try {
    const updatedBus = await Bus.findByIdAndUpdate(
      busId, 
      { isAvailable: false },  // Set the bus as unavailable
      { new: true }  // Return the updated document
    );

    if (!updatedBus) {
      return res.status(404).json({ message: 'Bus not found' });
    }

    res.status(200).json({
      message: 'Bus availability updated to false',
      bus: updatedBus
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating bus availability' });
  }
};

// Soft delete a bus by setting bus_status to false
exports.deleteBus =  async (req, res) => {
    try {
      // Find the bus by ID and update bus_status to false
      const updatedBus = await Bus.findByIdAndUpdate(
        req.params.id,
        { bus_status: false },  // Set bus_status to false (inactive)
        { new: true }  // Return the updated document
      );
  
      if (!updatedBus) {
        return res.status(404).json({ message: 'Bus not found' });
      }
  
      res.status(200).json({ message: 'Bus status updated to inactive', bus: updatedBus });
    } catch (error) {
      res.status(500).json({ message: 'Error updating bus status' });
    }
  };
  

 // for updating remaining_seats and seat_status after successfull booking
exports.updateSeats = async (req, res) => {
    console.log("Entered inside the patch after booking...");
    
    const { busId, selectedSeats } = req.body;  // Expecting busId and selectedSeats array
    if (!busId || !selectedSeats || selectedSeats.length === 0) {
      return res.status(400).json({ message: 'Bus ID and selected seats are required' });
    }
  
    try {
      // Find the bus by ID
      const bus = await Bus.findById(busId);
      
      if (!bus) {
        return res.status(404).json({ message: 'Bus not found' });
      }
  
      // Call the bookSeats method to update seat status and remaining seats
      await bus.bookSeats(selectedSeats);
  
      // Return success response with updated seat status
      return res.status(200).json({
        message: 'Seats updated successfully!',
        remainingSeats: bus.remaining_seats,  // Return updated remaining seats
        updatedSeats: selectedSeats,         // Return the selected booked seats
      });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error updating seats. Please try again later.' });
    }
  };

//for fetching booked seats in home screen
exports.getBookedSeats = async (req, res) => {
    console.log("entered inside get for home screen");
    
    try {
      const busId = req.params.busId;
  
      // Find the bus by busId
      const bus = await Bus.findById(busId).select('seats'); // Fetch only the 'seats' field
  
      if (!bus) {
        return res.status(404).json({ message: 'Bus not found' });
      }
  
      // Filter the seats that are booked
      const bookedSeats = bus.seats.filter(seat => seat.seat_status === 'booked');
  
      console.log("bookedSeats:"+bookedSeats);
      
  
      // Return the booked seats in the response
      res.json({
        busId: bus._id,
        bookedSeats: bookedSeats.map(seat => seat.seat_number), // Return only seat numbers
      });
    } catch (error) {
      console.error('Error fetching booked seats:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };