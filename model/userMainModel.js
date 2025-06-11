const mongoose = require('mongoose');

// Define schema for UserMain
const userMainSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    profileImage: { type: String, default: '/images/userPfile.avif' },
    userType: { type: String, default: 'resident' }, // Differentiation for user type
    status: { type: String, default: 'notVerified'}
});

// Create UserMain model
const UserMain = mongoose.model('UserMain', userMainSchema);

module.exports = UserMain;