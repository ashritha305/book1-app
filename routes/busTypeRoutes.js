// routes/busTypeRoutes.js

const express = require('express');
const busTypeController = require('../controllers/busTypesController'); // Import controller

const router = express.Router();

// 1. Create a new bus type
router.post('/', busTypeController.createBusType);

// 2. Get all bus types
router.get('/', busTypeController.getAllBusTypes);

// 3. Get a bus type by ID
router.get('/:id', busTypeController.getBusTypeById);

// 4. Update a bus type by ID
router.put('/:id', busTypeController.updateBusType);

// 5. Delete a bus type by ID
router.delete('/:id', busTypeController.deleteBusType);

module.exports = router;
