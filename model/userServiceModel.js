const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  Type_of_request: {
    Clearance: [{
      name: String,
      number: String,
      quantity: Number,
      purpose: String,
      status: String,
      id: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    Certificate: [{
      name: String,
      number: String,
      quantity: Number,
      purpose: String,
      status: String,
      id: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    Indigency: [{
      name: String,
      number: String,
      quantity: Number,
      purpose: String,
      status: String,
      id: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    Business: [{
      name: String,
      number: String,
      quantity: Number,
      purpose: String,
      status: String,
      id: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }]
  }
});

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;

