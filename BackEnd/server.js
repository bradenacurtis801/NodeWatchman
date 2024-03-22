const express = require('express');
const fs = require('fs').promises; 
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchAndUpdateMachineData = require('./rbm_api');
const rateLimit = require('express-rate-limit');
const config = require('../Config/config.js');
require('dotenv').config();
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const { readUsersFromFile, writeUsersToFile } = require('./userdb_models');

const REMOVED_JWT_SECRET = process.env.REMOVED_JWT_SECRET;
const MACHINE_STATE_FILE = './/db/machineState.json';
const USERS_FILE = './db/users.json';
const RBM_NODES_FILE = './db/rbm_nodes.json';
const INTERACTIVE_NODES_FILE = './db/interactive_nodes.json';
const DC02_HARDWARE_INFO = './db/DC02_HARDWARE_INFO_ALL.json'
const PENDING_REGISTRATIONS_FILE = './db/pendingRegistrations.json'

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'datacare234@gmail.com', // Your email address
      pass: 'uftx faiu skyc babj' // Your email password
    }
  });

// Ensure required JSON files exist
ensureFileExists(MACHINE_STATE_FILE, '[]');
ensureFileExists(USERS_FILE, '[]');
ensureFileExists(RBM_NODES_FILE, '[]');
ensureFileExists(INTERACTIVE_NODES_FILE, '[]');
ensureFileExists(PENDING_REGISTRATIONS_FILE, '[]');

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 3, // Limit to 3 requests per window
  handler: function (req, res /*, next */) {
    const resetTime = new Date(parseInt(res.getHeaders()["x-ratelimit-reset"]) * 1000);
    const currentTime = new Date();
    const timeToWait = Math.ceil((resetTime - currentTime) / 1000); // Time in seconds
    res.status(429).json({
      message: `Too many requests. Please try again in ${timeToWait} seconds.`
    });
  }
});
let tokenBlacklist = {};

const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(express.json({ limit: '50mb' }));
app.use('/update-miners', limiter);
// app.use(checkBlacklist);

app.get('/update-miners', authenticateToken, async (req, res) => {
    try {
	console.log('Received request to update miners');
        await fetchAndUpdateMachineData();
        console.log('miners database updated!')
        res.send('Miners updated successfully.');
    } catch (error) {
        console.error('Error updating miners:', error);
        res.status(500).send('Error updating miners.');
    }
});

app.post('/save-machine-state', authenticateToken, async (req, res) => {
    try {
        await fs.writeFile(MACHINE_STATE_FILE, JSON.stringify(req.body));
        res.send({ status: 'success' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error saving state');
    }
});


app.get('/load-machine-state', authenticateToken, async (req, res) => {
    try {
        let dataFile = MACHINE_STATE_FILE;
        if (req.query.source === 'rbm') {
            dataFile = RBM_NODES_FILE;
        }
        const data = await fs.readFile(dataFile, 'utf8');
        //console.log(`Data read from file: ${dataFile}`, data);
        const jsonData = data ? JSON.parse(data) : {};
        //console.log('Parsed JSON data:', jsonData);
        res.json(jsonData);
    } catch (err) {
        console.error('Error:', err);
        if (err.code === 'ENOENT') {
            console.log(`No existing file (${dataFile}). Sending empty state.`);
            res.json({ boxStates: {} });
        } else {
            res.status(500).send('Error loading state');
        }
    }
});

// Registration endpoint
app.post('/register', async (req, res) => {
    try {
        console.log('Received registration request:', req.body);
        const { email, password } = req.body; // Include email in the destructured object
        if (!email || !password) {
            // Return an error response if any of the required fields are missing
            return res.status(400).send('Missing required fields: username, email, and/or password.');
        }

        try {
            const data = await fs.readFile(USERS_FILE, 'utf8');
            users = data ? JSON.parse(data) : [];
        } catch (error) {
            if (error.code !== 'ENOENT') {
                throw error; // Rethrow the error if it's not a 'file not found' error
            }
            // If the file doesn't exist, we'll continue with an empty users array
        }

         // Check if user already exists
         if (users.some(user => user.email === email)) {
            return res.status(400).send('Username already exists');
        }

        let pendingRegistrations;

        // Load pending registrations
        try {
            const data = await fs.readFile(PENDING_REGISTRATIONS_FILE, 'utf8');
            pendingRegistrations = JSON.parse(data);
            if (!Array.isArray(pendingRegistrations)) {
                pendingRegistrations = [];
            }
        } catch (error) {
            if (error.code === 'ENOENT') {
                pendingRegistrations = [];
            } else {
                throw error;
            }
        }

        // Check for duplicate email in pending registrations
        if (pendingRegistrations.some(user => user.email === email)) {
            return res.status(400).send('Email is already pending approval.');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = uuidv4();

        // Append new pending registration with email
        pendingRegistrations.push({ email, hashedPassword, id: userId, isAdmin: false });
        await fs.writeFile(PENDING_REGISTRATIONS_FILE, JSON.stringify(pendingRegistrations, null, 2));

        // Send approval request to admin with email information
        const approvalLink = `http://10.10.250.101:${config.BACKEND_SERVER_PORT}/approve/${userId}`;
        const mailOptions = {
            from: 'datacare234@gmail.com',
            to: 'bradenacurtis801@gmail.com',
            subject: 'New User Sign-Up Request',
            text: `A new user has signed up with the email: ${email}.\n\nApprove: ${approvalLink}`
        };

        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.error('Error:', error);
                res.status(500).send('Error sending approval request.');
            } else {
                console.log('Approval request sent:', info.response);
                res.status(202).json({ message: 'Sign-up request submitted. Please wait for administrator approval.' });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error registering new user');
    }
});
  
  // Approval endpoint
  app.get('/approve/:id', async (req, res) => {
    const { id } = req.params;
    let pendingRegistrations = JSON.parse(await fs.readFile(PENDING_REGISTRATIONS_FILE, 'utf8'));
    const userIndex = pendingRegistrations.findIndex(user => user.id === id);
  
    if (userIndex !== -1) {
      const user = pendingRegistrations[userIndex];
      
      // Remove the user from pending registrations
      pendingRegistrations.splice(userIndex, 1);
      await fs.writeFile(PENDING_REGISTRATIONS_FILE, JSON.stringify(pendingRegistrations, null, 2));
  
      // Load the existing users
      let users;
      try {
        const data = await fs.readFile('./db/users.json', 'utf8');
        users = JSON.parse(data);
      } catch (error) {
        if (error.code === 'ENOENT') {
          // If the file doesn't exist, start with an empty array
          users = [];
        } else {
          // Rethrow the error if it's not because the file doesn't exist
          throw error;
        }
      }
  
      // Add the approved user to the users array
      users.push(user);
  
      // Save the updated users array to users.json
      await fs.writeFile('./db/users.json', JSON.stringify(users, null, 2));
  
      res.send('User approved successfully.');
      console.log('User approved:', user);
    } else {
      res.status(404).send('Registration not found.');
    }
  });

  app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email, password)

        // Read the users and admins file
        const usersData = await fs.readFile(USERS_FILE, 'utf8');
        const users = JSON.parse(usersData);

        // Find the user by username
        const user = users.find(u => u.email === email);

        // Check if user exists and password is correct
        if (user && await bcrypt.compare(password, user.hashedPassword)) {
            console.log(user)
            // Sign a token. Include a flag in the token payload to indicate if the user is an admin
            const token = jwt.sign({ email: email, isAdmin: user.isAdmin || false }, REMOVED_JWT_SECRET, { expiresIn: '9999 years' });
            res.json({ token });
        } else {
            res.status(401).send('Invalid credentials');
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('Error during login');
    }
});

app.post('/admin/revoke', authenticateToken, checkAdmin, async (req, res) => {
    // In a real application, you'd check here if the requester is authenticated as an admin
    const { user_email } = req.body;
  
    try {
      // Load the existing users
      let users = JSON.parse(await fs.readFile('./db/users.json', 'utf8'));
  
      const userIndex = users.findIndex(user => user.email === user_email);
      if (userIndex === -1) {
        return res.status(404).send('User not found.');
      }
  
      // Example of revoking a ban and resetting permissions
      users[userIndex].banned = false; // Assuming 'banned' is a boolean
      users[userIndex].permissions = []; // Assuming permissions is an array, adjust as needed
  
      // Save the updated users array back to the file
      await fs.writeFile('./db/users.json', JSON.stringify(users, null, 2));
  
      res.send('User ban revoked and permissions reset.');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error processing request');
    }
  });
  

// API endpoint to handle logout
app.post('/logout', (req, res) => {
    const token = req.headers['authorization'].split(' ')[1];
    blacklistToken(token);
    res.send('Logged out successfully');
});

app.post('/interact/update-machine-state', async (req, res) => {
    // Directly use req.body as it contains the executeResult array
    const executeResult = req.body;

    // Validate the executeResult to ensure it's not empty and is an array
    if (!Array.isArray(executeResult) || executeResult.length === 0) {
        return res.status(400).send('Invalid or empty execute result provided');
    }

    // Process the received data and save it to INTERACTIVE_NODES_FILE
    try {
        // Write the executeResult array to the file
        await fs.writeFile(INTERACTIVE_NODES_FILE, JSON.stringify(executeResult, null, 2));
        console.log(executeResult);
        // Respond with a success message
        res.json({ status: 'success', message: 'Interactive machine state updated successfully.' });
    } catch (error) {
        console.error('Error saving interactive machine state:', error);
        res.status(500).send('Error processing request');
    }
});

app.get('/interact/load-machine-state', async (req, res) => {
    try {
        let dataFile = INTERACTIVE_NODES_FILE;

        const data = await fs.readFile(dataFile, 'utf8');
        //console.log(`Data read from file: ${dataFile}`, data);
        const jsonData = data ? JSON.parse(data) : {};
        //console.log('Parsed JSON data:', jsonData);
        res.json(jsonData);
    } catch (err) {
        console.error('Error:', err);
        if (err.code === 'ENOENT') {
            console.log(`No existing file (${dataFile}). Sending empty state.`);
            res.json({ boxStates: {} });
        } else {
            res.status(500).send('Error loading state');
        }
    }
});

app.get('/interact/dc02-hardware-info', async (req, res) => {
    try {
        let dataFile = DC02_HARDWARE_INFO;

        const data = await fs.readFile(dataFile, 'utf8');
        //console.log(`Data read from file: ${dataFile}`, data);
        const jsonData = data ? JSON.parse(data) : {};
        //console.log('Parsed JSON data:', jsonData);
        res.json(jsonData);
    } catch (err) {
        console.error('Error:', err);
        if (err.code === 'ENOENT') {
            console.log(`No existing file (${dataFile}). Sending empty state.`);
            res.json({ boxStates: {} });
        } else {
            res.status(500).send('Error loading state');
        }
    }
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log(token)

    if (token == null) return res.status(401).send('Token is required');

    jwt.verify(token, REMOVED_JWT_SECRET, (err, user) => {
        if (err) return res.status(403).send('Token is invalid or expired');
        req.user = user;
        next();
    });
}

function checkAdmin(req, res, next) {
    // Assumes req.user is set by authenticateToken
    if (!req.user || !req.user.isAdmin) {
        return res.status(403).send('Access denied');
    }
    next(); // User is admin, proceed to the next middleware
}


function blacklistToken(token) {
    // Assume the token has a certain expiration time, e.g., 1 hour
    const EXPIRY_TIME_IN_MS = 3600 * 1000; // 1 hour in milliseconds

    // Add the token to the blacklist
    tokenBlacklist[token] = true;

    // Set a timeout to remove the token from the blacklist after it expires
    setTimeout(() => {
        delete tokenBlacklist[token];
    }, EXPIRY_TIME_IN_MS);
}

function checkBlacklist(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).send('No token provided');
    }

    const token = authHeader.split(' ')[1];
    if (tokenBlacklist[token]) {
        return res.status(401).send('Token has been invalidated');
    }

    next();
}

// Function to ensure a file exists, and create it with default content if it doesn't
async function ensureFileExists(filePath, defaultContent) {
    try {
        const fileExists = await fs.access(filePath).then(() => true).catch(() => false);
        if (!fileExists) {
            await fs.writeFile(filePath, defaultContent);
        }
    } catch (err) {
        console.error(`Error ensuring file exists: ${filePath}`, err);
    }
}



async function createAdminUser() {
    const email = 'bradenacurtis801@gmail.com';
    const username = 'bradenacurtis801';
    const password = 'wpkf0224'; // Choose a strong, secure password
    const hashedPassword = await bcrypt.hash(password, 10);

    const User = {
        email,
        username,
        hashedPassword,
        isAdmin: true
    };

    // Attempt to read the existing admins file
    let users;
    try {
        const data = await fs.readFile(USERS_FILE, 'utf8');
        users = JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            // File does not exist, start with an empty array
            users = [];
        } else {
            // Rethrow any other error
            throw error;
        }
    }

    // Check if the admin user already exists
    const existingUser = users.find(users => users.email === email);
    if (existingUser) {
        console.log('User already exists.');
        return; // Stop execution if the admin already exists
    }

    // Add the new admin user to the array
    users.push(User);

    // Save the updated admins array back to the file
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));

    console.log('Admin user created successfully.');
}
  
//   createAdminUser().catch(console.error);

app.listen(config.BACKEND_SERVER_PORT, '0.0.0.0', () => console.log(`Server started on port ${config.BACKEND_SERVER_PORT}`));

