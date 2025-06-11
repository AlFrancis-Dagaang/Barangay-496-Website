const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true, // Email is required
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "Pending", // Default status
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically sets to the current date/time
  },
  id: {
    type: String,
    required: true,
  },
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
