const express = require('express');
const fs = require('fs');
const session = require('express-session');
const https = require('https');
const passport = require('passport');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

// Load environment variables
dotenv.config();
require('./config/passport');

// Connect to the database
connectDB();

const app = express();
app.use(express.json());

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET, 
  resave: true, 
  saveUninitialized: true
}));

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);

// HTTPS server setup
if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development') {
  const options = {
    key: fs.readFileSync('path/to/your/server.key'), // Path to your private key
    cert: fs.readFileSync('path/to/your/server.cert'), // Path to your certificate
    // If using a CA-signed certificate, you may also need to specify the CA
    // ca: fs.readFileSync('path/to/your/ca.cert')
  };

  https.createServer(options, app).listen(process.env.PORT, () => {
    console.log(`Server running on https://localhost:${process.env.PORT}`);
  });
} else {
  app.listen(process.env.PORT, () => {
    console.log(`Server running on http://localhost:${process.env.PORT}`);
  });
}
