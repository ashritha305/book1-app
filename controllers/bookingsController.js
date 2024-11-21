const Booking = require('../models/bookings');
const Bus = require('../models/bus');
const Route = require('../models/routes');

const createBooking = async (req, res) => {
    console.log("entering inside post bookings...");
    

    const {
        busId, routeId, bookedSeats, passengerDetails, userId, bookingDate, status, totalFare
    } = req.body;
    try {
        // Step 1: Validate if the bus exists
        const bus = await Bus.findById(busId); // Use busId from request body
        if (!bus) {
            return res.status(404).json({ error: 'Bus not found' });
        }

        // Step 2: Validate if the route exists
        const route = await Route.findById(routeId);
        if (!route) {
            return res.status(404).json({ error: 'Route not found' });
        }

        // Step 5: Create the passenger details array
        const passengerDetailsArray = passengerDetails.map((passenger, index) => ({
            name: passenger.name,
            age: passenger.age,
            gender: passenger.gender,
            seat_number: bookedSeats[index], // Assign each seat to the respective passenger
        }))
     
        // Step 6: Create the booking object
        const booking = new Booking({
            busId: busId,
            routeId: routeId,
            bookedSeats: bookedSeats,
            passengerDetails: passengerDetailsArray,
            userId: userId,
            bookingDate: new Date(bookingDate), // Use the booking date from request body
            status: status || 'Confirmed', // Default to 'Confirmed' if status is not provided
            totalFare: totalFare, // Set the total fare based on the calculated or provided fare
        });

        

        // Step 7: Save the booking to the database
        await booking.save();
        console.log("post saved.. 124");

        // Step 9: Return the booking details in the response
        res.status(201).json({
            bookingId: booking._id,
            busId: busId,
            routeId: routeId,
            bookedSeats: bookedSeats,
            passengerDetails: passengerDetailsArray,
            totalFare: totalFare,
            status: booking.status,
        });

    } catch (error) {
        console.error('Error during booking:', error);
        res.status(500).json({ error: 'Failed to create booking' });
    }
};

//for fetching past bookings
const getPastBookings =async (req, res) => {
    console.log("entered inside past bookings..");
    
    const userId = req.params.userId;
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
  
    try {
      const bookings = await Booking.find({ userId: userId }) .populate({
        path: 'routeId', // Populate the routeId field
        populate: [
          { path: 'starting_stop_id', select: 'stopName' }, // Populate starting stop name
          { path: 'ending_stop_id', select: 'stopName' }     // Populate ending stop name
        ]
      })
      .populate({
          path: 'busId', // Populate the busId field
          populate: {
            path: 'driver_id', // Populate the driver_id field in the bus
            select: 'name'     // We want to get only the driver's name
          }
        }) // Optionally, populate busId for bus details like bus number
      .exec();
      const pastBookings = bookings.filter(booking => new Date(booking.bookingDate) < currentDate);
      res.status(200).json({ pastBookings });
    } catch (error) {
      console.error("Error fetching past bookings:", error);
      res.status(500).json({ message: 'Error fetching past bookings', error });
    }
  };


  // Fetching upcoming bookings
const getUpcomingBookings = async (req, res) => {
    console.log("entered inside upcoming bookings..");
    const userId = req.params.userId;
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
  
    try {
      // Fetch bookings
      const bookings = await Booking.find({ userId: userId })
        .populate({
          path: 'routeId', // Populate the routeId field
          populate: [
            { path: 'starting_stop_id', select: 'stopName' }, // Populate starting stop name
            { path: 'ending_stop_id', select: 'stopName' }     // Populate ending stop name
          ]
        })
        .populate({
            path: 'busId', // Populate the busId field
            populate: {
              path: 'driver_id', // Populate the driver_id field in the bus
              select: 'name'     // We want to get only the driver's name
            }
          }) // Optionally, populate busId for bus details like bus number
        .exec();
  
      // Filter upcoming bookings
      const upcomingBookings = bookings.filter(booking => new Date(booking.bookingDate) >= currentDate);
      
    //   console.log("upcomingBookings:", upcomingBookings);
  
      res.status(200).json({ upcomingBookings });
    } catch (error) {
      console.error("Error fetching upcoming bookings:", error);
      res.status(500).json({ message: 'Error fetching upcoming bookings', error });
    }
  };
  

// for fetching all the bookings in booking management
const getAllBookings =  async (req, res) => {
    console.log("Entered inside get route for all bookings");

    try {
        // Fetch bookings where user is_available is true and bus bus_status is true
        const bookings = await Booking.find()
            .populate({
                path: 'userId',  // Populate the userId field to get user details
                match: { is_available: true },  // Only populate users with is_available = true
            })
            .populate({
                path: 'busId',  // Populate the busId field
                match: { bus_status: true },  // Only populate buses with bus_status = true
                populate: {
                    path: 'driver_id',  // Populate the driver_id field in the bus
                    select: 'name'  // We want to get only the driver's name
                }
            })
            .populate({
                path: 'routeId',  // Populate the routeId field
                populate: [
                    { path: 'starting_stop_id', select: 'stopName' },  // Populate starting stop name
                    { path: 'ending_stop_id', select: 'stopName' }     // Populate ending stop name
                ]
            })
            .exec();

        // Filter out the bookings where the user or bus doesn't meet the criteria (is_available and bus_status)
        const filteredBookings = bookings.filter(booking => booking.userId && booking.busId);

        console.log("Filtered bookings:", filteredBookings);

        // Map over the bookings to include the status in the response
        const responseBookings = filteredBookings.map(booking => ({
            _id: booking._id,
            busId: booking.busId,
            userId: booking.userId,
            from: booking.routeId.starting_stop_id.stopName, // Assuming routeId contains starting stop
            to: booking.routeId.ending_stop_id.stopName, // Assuming routeId contains ending stop
            date: booking.bookingDate,
            departureTime: booking.busId.arrival_time,  // Assuming departure time is the arrival time in busId
            bookedSeats: booking.bookedSeats,
            status: booking.status, // Include booking status
            remainingSeats: booking.busId.remaining_seats, // Fetch remaining seats from the bus
        }));

        res.status(200).json(responseBookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ error: 'Failed to fetch bookings.' });
    }
};


//cancelling bookings by admin..
const cancelBooking = async (req, res) => {

    console.log("entered put...");
    
    try {
        const bookingId = req.params.bookingId;

        // Find the booking
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // Find the corresponding bus
        const bus = await Bus.findById(booking.busId);
        if (!bus) {
            return res.status(404).json({ error: 'Bus not found' });
        }

        // Restore booked seats back to available in the bus
        booking.bookedSeats.forEach(seatNumber => {
            const seat = bus.seats.find(s => s.seat_number === seatNumber);
            if (seat) {
                seat.seat_status = 'available'; // Change seat status back to available
            }
        });

        // Update remaining seats on the bus
        bus.remaining_seats += booking.bookedSeats.length;

        // Update booking status to "Cancelled"
        booking.status = 'Cancelled';

        // Save the updated booking and bus details
        await booking.save();
        await bus.save();

        res.status(200).json({ message: 'Booking cancelled successfully.', booking });
    } catch (error) {
        console.error('Error cancelling booking:', error);
        res.status(500).json({ error: 'Failed to cancel booking.' });
    }
};


// booking cancelation in Upcoming screen
const cancelSeats =  async (req, res) => {
    console.log("entering here...!");
    
    try {
        const bookingId = req.params.bookingId;
        const { bookedSeats } = req.body; // Receive the seats to cancel

        // Find the booking
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // Find the corresponding bus
        const bus = await Bus.findById(booking.busId);
        if (!bus) {
            return res.status(404).json({ error: 'Bus not found' });
        }

        // Update booked seats and seat statuses
        const updatedBookedSeats = booking.bookedSeats.filter(seat => !bookedSeats.includes(seat));
        booking.bookedSeats = updatedBookedSeats;

        bookedSeats.forEach(seatNumber => {
            const seat = bus.seats.find(s => s.seat_number === seatNumber);
            if (seat) {
                seat.seat_status = 'available'; // Change seat status back to available
            }
        });

        // Update the bus's remaining seats
        bus.remaining_seats += bookedSeats.length;

        // Check if all seats are canceled and update booking status
        if (updatedBookedSeats.length === 0) {
            booking.status = 'Cancelled'; // Update status if all seats are cancelled
        }

        await booking.save(); // Save the updated booking
        await bus.save(); // Save the updated bus details

        res.status(200).json({ message: 'Seats cancelled successfully.' });
    } catch (error) {
        console.error('Error canceling seats:', error);
        res.status(500).json({ error: 'Failed to cancel seats.' });
    }
};

module.exports = {
    createBooking,
    getPastBookings,
    getUpcomingBookings,
    getAllBookings,
    cancelBooking,
    cancelSeats,
};
