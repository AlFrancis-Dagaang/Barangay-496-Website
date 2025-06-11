const mongoose = require('mongoose');

// Define the schema with default values
const adminMainSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        default: 'barangay496.manila@gmail.com', // Default email
    },
    password: {
        type: String,
        required: true,
        default: 'admin', // Default plaintext password - use cautiously
    },
    userType: {
        type: String,
        default: 'admin', // Default user type
    },
});

// Create AdminMain model
const AdminMain = mongoose.model('AdminMain', adminMainSchema);

module.exports = AdminMain;