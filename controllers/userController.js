const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const multer = require('multer');

const Users = require('../models/users');

const upload = require('../middleWares/upload');  // Import your upload middleware

const saltRounds = 10;
const JWT_SECRET = process.env.JWT_SECRET;

// Register a new user
const registerUser =  async (req, res) => {
    console.log("entered here....");
    
    try {
        const { name, email, password, confirmPassword, mobile,role } = req.body;
        // console.log("req.body:"+JSON.stringify(req.body));
        // console.log("confirmPassword:"+confirmPassword);
        if (!name || !email || !password || !confirmPassword || !mobile) {
            return res.status(400).json({ error: 'All fields are required' });
        }

      
        if (password !== confirmPassword) {
            return res.status(400).json({ error: 'Passwords do not match' });
        }

        
        const existingUser = await Users.findOne({
            $or: [{ email }, { mobile }]
        });

        if (existingUser) {
            return res.status(400).json({ error: 'User already exists with this email or phone' });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const travelerUser = new Users({
            name,
            email,
            password: hashedPassword,
            mobile,
            role, 
        });

        await travelerUser.save();
        return res.status(201).json({ message: 'Registration successful!' });
        
    } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Login a user
const loginUser = async (req, res) => {
    console.log("Entered login...");

    const { identifier, password } = req.body;

    // Validation for email or phone number format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const phoneRegex = /^\d{10}$/;

    const isEmail = emailRegex.test(identifier);
    const isPhone = phoneRegex.test(identifier);

    if (!isEmail && !isPhone) {
        return res.status(400).json({ error: 'Invalid email or phone number.' });
    }

    try {
        // Find user by email or phone
        const user = await Users.findOne({
            $or: [{ email: identifier }, { mobile: identifier }]
        });

        if (!user) {
            return res.status(400).json({ error: 'User not found.' });
        }

        // Check password
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(400).json({ error: 'Incorrect password.' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email, password: user.password },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.status(200).json({
            message: `Welcome, ${user.role.charAt(0).toUpperCase() + user.role.slice(1)}!`,
            token,
            role: user.role,
            name: user.name,
            email: user.email,
            userId: user._id,
        });

    } catch (err) {
        console.error('Error during login:', err);
        return res.status(500).json({ error: 'Internal server error.' });
    }
};


 // for userManagement
const getAllUsers = async (req, res) => {
    try {
        console.log("Entered /users route");
        
        // Fetch users where is_available is true
        let response = await Users.find({ is_available: true });
        
        res.status(200).json(response);
        console.log('Users fetched successfully');
    } catch (err) {
        res.status(500).json({ 'error': err });
    }
};

//get Specified user
const getUserById = async (req, res) => {
    try {
        console.log("Entered inside get");
        let id = req.params.id;
        console.log(id);
        
        let speUser = await Users.find({ "_id": id });
        if (!speUser) {
            return res.status(404).json('user not found');
        }
        console.log("speUser:"+speUser);
        
        res.status(200).json(speUser);
    }
    catch (err) {
        res.status(500).json({ 'error': err });
    }
}


 // Update user profile
const updateUserProfile = async (req, res) => {
    try {
        const id = req.params.id;
        let data = req.body;

        if (req.file) {
            data.profilePicture = path.join('uploads', req.file.filename); // Store the relative path
        }

        let updatedUser = await Users.findByIdAndUpdate(id, data, { new: true }); // Use { new: true } to return the updated document
        if (!updatedUser) {
            return res.status(404).json('User not found');
        }

        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

 // Update user availability status
const updateUserAvailability = async (req, res) => {
    try {
        const { id } = req.params; // Get user ID from URL params
        const { is_available } = req.body; // Get new is_available status from the request body

        if (typeof is_available !== 'boolean') {
            return res.status(400).json({ error: 'is_available must be a boolean' });
        }

        // Find and update the user by their ID, setting the new is_available status
        const updatedUser = await Users.findByIdAndUpdate(
            id,
            { is_available },  // Update the is_available field
            { new: true }       // Return the updated user
        );

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(updatedUser);
        console.log('User updated successfully');
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// // Delete user
const deleteUser =async (req, res) => {
    console.log("Entered server side");               
    try {
        let id = req.params.id;
        console.log(id);
        let deletedPerson = await Users.findByIdAndDelete(id)
        console.log("deleted:"+deletedPerson);
        if (!deletedPerson) {
            return res.status(404).json('user not found');
        }
        res.status(200).json('deleted successfully')
    }
    catch (err) {
        res.status(500).json('internal server error');
    }
}
module.exports = {
    upload,
    registerUser,
    loginUser,
    getAllUsers,
    getUserById,
    updateUserProfile,
    updateUserAvailability,
    deleteUser,
};
