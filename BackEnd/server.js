const express = require('express');
const fs = require('fs').promises; 
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const REMOVED_JWT_SECRET = process.env.REMOVED_JWT_SECRET;
const machineStateFile = './machineState.json';
const USERS_FILE = './users.json';

const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(express.json());

app.post('/save-machine-state', async (req, res) => {
    try {
        await fs.writeFile(machineStateFile, JSON.stringify(req.body));
        res.send({ status: 'success' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error saving state');
    }
});


app.get('/load-machine-state', async (req, res) => {
    console.log("Endpoint /load-machine-state hit");

    try {
        const data = await fs.readFile(machineStateFile, 'utf8');
        console.log('Data read from file:', data);

        const jsonData = data ? JSON.parse(data) : {};
        console.log('Parsed JSON data:', jsonData);
        res.json(jsonData);
    } catch (err) {
        console.error('Error:', err);
        if (err.code === 'ENOENT') {
            console.log('No existing state file. Sending empty state.');
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
        console.log("Current Working Directory:", process.cwd());
        console.log("REMOVED_JWT_SECRET:", process.env.REMOVED_JWT_SECRET);


        // Read the users file
        const data = await fs.readFile(USERS_FILE, 'utf8');
        const users = JSON.parse(data);

        // Find the user by username
        const user = users.find(u => u.username === username);

        // Check if user exists and password is correct
        if (user && await bcrypt.compare(password, user.hashedPassword)) {
            const token = jwt.sign({ username: username }, REMOVED_JWT_SECRET, { expiresIn: '1h' });
            res.json({ token });
        } else {
            res.status(401).send('Invalid credentials');
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('Error during login');
    }
});

app.listen(3000, '0.0.0.0', () => console.log('Server started on port 3000'));
