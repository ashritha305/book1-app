// routes/userRoutes.js
const express = require('express');


const router = express.Router();
const userController = require('../controllers/userController');  // Import the controller

// Register a new user
router.post('/register', userController.registerUser);

// Login user
router.post('/login', userController.loginUser);

// Fetch all users
router.get('/users', userController.getAllUsers);

// Fetch a specific user by ID
router.get('/users/:id', userController.getUserById);

 // Update user profile
 router.put('/users/:id', userController.upload.single('profilePicture'), userController.updateUserProfile);


// Update user availability status
router.patch('/users/:id', userController.updateUserAvailability);

 // Delete user
router.delete('/users/:id', userController.deleteUser);

module.exports = router;




