// routes/stopRoutes.js
const express = require('express');
const stopController = require('../controllers/stopController'); // Adjust path as necessary

const router = express.Router();

// Create a new stop
router.post('/', stopController.createStop);

// Get all stops or filtered stops based on a query parameter
router.get('/', stopController.getAllStops);

// Update a stop by ID
router.put('/:id', stopController.updateStopById);

// Delete a stop by ID
router.delete('/:id', stopController.deleteStopById);

module.exports = router;
