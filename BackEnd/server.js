const express = require('express');
const fs = require('fs').promises; 
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchAndUpdateMachineData = require('./rbm_api');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const REMOVED_JWT_SECRET = process.env.REMOVED_JWT_SECRET;
const machineStateFile = './machineState.json';
const USERS_FILE = './users.json';
const RBM_NODES_FILE = './rbm_nodes.json';

let tokenBlacklist = {};

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

const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(express.json());
app.use('/update-miners', limiter);
// app.use(checkBlacklist);

app.get('/update-miners', async (req, res) => {
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
        await fs.writeFile(machineStateFile, JSON.stringify(req.body));
        res.send({ status: 'success' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error saving state');
    }
});


app.get('/load-machine-state', authenticateToken, async (req, res) => {
    try {
        let dataFile = machineStateFile;
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

app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Initialize an empty array for users
        let users = [];

        // Try to read the existing users file
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
        if (users.some(user => user.username === username)) {
            return res.status(400).send('Username already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Add new user
        users.push({ username, hashedPassword });

        // Save updated users
        await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));

        res.status(201).send('User registered successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error registering new user');
    }
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Read the users file
        const data = await fs.readFile(USERS_FILE, 'utf8');
        const users = JSON.parse(data);

        // Find the user by username
        const user = users.find(u => u.username === username);

        // Check if user exists and password is correct
        if (user && await bcrypt.compare(password, user.hashedPassword)) {
            const token = jwt.sign({ username: username }, REMOVED_JWT_SECRET, { expiresIn: '9999 years' });
            res.json({ token });
        } else {
            res.status(401).send('Invalid credentials');
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('Error during login');
    }
});

// API endpoint to handle logout
app.post('/logout', (req, res) => {
    const token = req.headers['authorization'].split(' ')[1];
    blacklistToken(token);
    res.send('Logged out successfully');
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


app.listen(3000, '0.0.0.0', () => console.log('Server started on port 3000'));
