const AdminMain = require('./model/adminMainModel');

// Define an async function to ensure the admin account is created once
async function ensureAdminAccount() {
  // Check if the admin account already exists
  const existingAdmin = await AdminMain.findOne({
    email: 'barangay496.manila@gmail.com', // Specific email to check
  });

  // If no existing admin account, create it
  if (!existingAdmin) {
    const newAdmin = new AdminMain({
      email: 'barangay496.manila@gmail.com',
      password: 'admin', // In production, hash the password
    });

    await newAdmin.save();
    console.log('Admin account created');
  } else {
    console.log('Admin account is ready');
  }
}

module.exports = ensureAdminAccount;