// routes/driverRoutes.js

const express = require('express');
const driverController = require('../controllers/driverContoller'); // Import controller

const router = express.Router();

// 1. Get all drivers or filter by status
router.get('/drivers', driverController.getDrivers);

// 2. Add a new driver
router.post('/drivers', driverController.addDriver);

// 3. Update an existing driver
router.put('/drivers/:id', driverController.updateDriver);

// 4. Update driver status (e.g., deactivate or reactivate)
router.put('/drivers/status/:id', driverController.updateDriverStatus);

// // 5. Delete a driver
// router.delete('/drivers/:id', driverController.deleteDriver);

module.exports = router;
