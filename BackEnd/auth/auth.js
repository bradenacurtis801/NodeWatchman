import { promises as fs } from 'fs';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import nodemailer from 'nodemailer';

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'datacare234@gmail.com', // Your email address
      pass: 'uftx faiu skyc babj' // Your email password
    }
  });

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

export default { authenticateToken, checkAdmin, checkBlacklist, blacklistToken }