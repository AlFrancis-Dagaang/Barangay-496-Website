const mongoose = require('mongoose');

const existingDataBase = new mongoose.Schema({
  fullName: {
    type: String,
    required: true, // Makes this field mandatory
  },
  address: {
    type: String,
    required: true, // Address is also required
  },
  sex: {
    type: String,
    required: true,
    enum: ['male', 'female', 'non-binary', 'other'], // Optional: Restrict to certain values
  },
  birthdate: {
    type: String,
    required: true,
  },
});

const ExistingUserData = mongoose.model('ExistingResidentData', existingDataBase); // Create a Mongoose model from the schema

module.exports = ExistingUserData; 