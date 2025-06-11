const mongoose = require('mongoose');

const gmailOTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  otp: {
    type: String,
    required: true
  }
});

const GmailOTP = mongoose.model('GmailOTP', gmailOTPSchema);

module.exports = GmailOTP;