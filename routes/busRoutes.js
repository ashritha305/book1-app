// routes/busRoutes.js

const express = require('express');
const busController = require('../controllers/busController');

const router = express.Router();

// Fetch all active buses
router.get('/', busController.getActiveBuses);

// Create a new bus
router.post('/', busController.createBus);

// Update a bus by ID
router.put('/:id', busController.updateBus);

// Update bus availability to false after adding it to a route
router.patch('/:busId', busController.updateBusAvailability);

// Soft delete a bus (update bus_status to false)
router.delete('/:id', busController.deleteBus);

// Update seats after successful booking
router.patch('/update/seats', busController.updateSeats);

// Fetch booked seats for a bus
router.get('/:busId', busController.getBookedSeats);

module.exports = router;
