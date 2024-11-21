const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routesController');

// Create a new route
router.post('/api/routes', routeController.createRoute);

// Get all routes for Route Management
router.get('/api/routes', routeController.getRoutes);

// Get route details for Home Screen
router.get('/routes/details', routeController.getRouteDetails);

// Update a route by ID
router.put('/api/routes/:id', routeController.updateRoute);

// Delete a route by ID
router.delete('/api/routes/:id', routeController.deleteRoute);

module.exports = router;
