let mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ['admin', 'traveler'],
    },
    profilePicture: {
        type: String, // Store the URL of the image
        default: 'https://wallpapers.com/images/hd/girl-in-all-black-outfit-pfp-aesthetic-qb6mk3z43kkayw2w.jpg' 
    },
    is_available: {
        type: Boolean,
        default: true // This sets the default value of the is_available field to true
    }
});

let Users = mongoose.model('Users', userSchema);
module.exports = Users;


