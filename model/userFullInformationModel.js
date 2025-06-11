const mongoose = require('mongoose');

// Define the schema with all fields as required strings
const userFullInformationSchema = new mongoose.Schema({
  fullName: {
    type: String,
  },
  userName: {
    type: String,
    required: true, // User name is required
  },
  birthDate: {
    type: String,
  },
  sex: {
    type: String,
    
  },
  address: {
    type: String,
    
  },
  id: {
    type: String,
    
  },
  email: {
    type: String,
    required: true, // Email is required
  },
  status: {
    type: String,
    default: 'notVerified'
  },
});

// Create a model from the schema
const UserFullInformation = mongoose.model('UserFullInformation', userFullInformationSchema);

module.exports = UserFullInformation; // Export the model
