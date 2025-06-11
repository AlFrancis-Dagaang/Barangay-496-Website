const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define a schema for complaint_information
const complaintInformationSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  serviceType: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  resolvedInformation: {
    type: String,
  },
  status: {
    type: String,
    default: "Pending", // Default status
  },
  dateOfComplaint: {
    type: Date,
    default: Date.now, // Default to current date and time
  },
});

// Define the main schema with email and the array of complaint_information
const ComplaintSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  complaint_information: [complaintInformationSchema], // Array of complaint information
});

// Export the model
const UserComplaints = mongoose.model("usercomplaint", ComplaintSchema);

module.exports = UserComplaints;
