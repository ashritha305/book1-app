const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingsController');


router.post('/bookings', bookingController.createBooking);

router.get('/bookings/:userId/past', bookingController.getPastBookings);

router.get('/bookings/:userId/upcoming', bookingController.getUpcomingBookings);
router.get('/bookings', bookingController.getAllBookings);
router.put('/bookings/:bookingId', bookingController.cancelBooking);
router.patch('/bookings/:bookingId/cancel-seats', bookingController.cancelSeats);

module.exports = router;
