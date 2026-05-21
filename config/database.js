// database.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://Pollywag:p0llywag123@barangaydatabase.kb5qqui.mongodb.net/Barangay_DataBase?retryWrites=true&w=majority&appName=BarangayDataBase', {
    });
    console.log("Successfully connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
