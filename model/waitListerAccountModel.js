const mongoose = require('mongoose');

const waitListerAccountSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
    default: '/images/userPfile.avif',
  },
  userType: {
    type: String,
    default: 'resident',
  },
  status: {
    type: String,
    default: 'notVerified',
  },
});

const WaitListerAccount = mongoose.model('WaitListerAccount', waitListerAccountSchema);

module.exports = WaitListerAccount;
