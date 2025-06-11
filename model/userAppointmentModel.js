const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the schema for an individual appointment
const appointmentSchema = new Schema({
  id: {
    type: String, // Unique identifier for the appointment
    required: true, // Ensure it's always present
  },
  appointmentCode: {
    type: String, // Code to identify the appointment
    required: true, // Ensure it's always present
  },
  dateOfAppointment: {
    type: Date, // Date of the appointment
  },
  status: {
    type: String, // Date of the appointment
  },
  appointmentType: {
    type: String, // Type of the appointment (e.g., Initial Consultation, Follow-up, etc.)
    required: true, // Ensure it's always present
  },
}, { _id: false }); // Disable _id since we'll use a custom id field

// Define the schema for the user with a collection of appointments
const userSchema = new Schema({
  email: {
    type: String, // Email of the user
    required: true, // Ensure it's always present
    unique: true, // Ensure each email is unique
  },
  appointments: [appointmentSchema], // Collection of appointments for the user
}, { timestamps: true }); // Include createdAt and updatedAt fields

const UserAppointment = mongoose.model('UserAppointment', userSchema); // Create the model

module.exports = UserAppointment;
