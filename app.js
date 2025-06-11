// app.js
const express = require('express');
const connectDB = require('./database');
const frontRoutes = require('./frontRoutes');
const userPageRoutes = require('./user-page-routes');
const statusPageRoutes = require('./status-page-routes');
const adminRoutes = require('./adminRoutes');
const ensureAdminAccount = require('./admin-creation');
const initializeDefaultData = require("./existing-data-base-creation");
const emailSample = require('./testingEmailRoutes.js');// <----for testing pusposes
const session = require('express-session');
const path = require('path');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const app = express();

//Session ID cookie


const PORT = 3000;

// Connect to MongoDB
connectDB();

app.use(session({
  secret: 'your_secret_key', // Replace with your own secret key
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    client: mongoose.connection.getClient(),
  }), // MongoDB-backed session store
}));

//Ready the admin side
ensureAdminAccount();

//Process the Existing database
initializeDefaultData();

app.use(emailSample); // <----for testing pusposes

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Add this line to parse JSON data
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('Public'));


// Routes
app.use('/', frontRoutes);
app.use('/', userPageRoutes);
app.use('/', statusPageRoutes);
app.use('/', adminRoutes);






app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});




