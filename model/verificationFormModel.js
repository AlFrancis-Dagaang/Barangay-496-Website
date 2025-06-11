const mongoose = require('mongoose');

// Define the schema for the verification model
const verificationSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    birthdate: {
        type: String,
        required: true
    },
    sex: {
        type: String,
        enum: ['male', 'female'],
        required: true
    },
    email: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'To Verify', // Default user type
    },
});

// Create the Mongoose model
const VerificationModel = mongoose.model('Verification', verificationSchema);

module.exports = VerificationModel;
