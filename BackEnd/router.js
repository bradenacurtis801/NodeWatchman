import { Router } from "express";
import authenticateToken from "./auth/auth.js";
import fs from "fs/promises"; // Import fs using promise-based API
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config({ path: './.env' })
import jwt from "jsonwebtoken";
import pool from "./db/db.js";
import { generateUpdateList } from "./utils/utils.js";

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const REMOVED_JWT_SECRET = process.env.REMOVED_JWT_SECRET;
const router = Router();

router.post("/update-machine-state", async (req, res) => {
  const updatedStates = req.body; // Directly use req.body as it contains the updated machine states

  // Validate the updatedStates to ensure it's not empty and is an array
  if (!Array.isArray(updatedStates) || updatedStates.length === 0) {
      console.log('Invalid or empty updated states provided');
      return res.status(400).send('Invalid or empty updated states provided');
  }

  try {
      const client = await pool.connect();
      
      // Load the current machine states from your database or a file
      // For this example, let's assume you're loading it from a JSON file as before
      const currentData = await fs.readFile('path/to/your/currentStates.json', 'utf8');
      const currentStates = JSON.parse(currentData);
      
      // Use generateUpdateList to identify what needs to be updated
      const updatesNeeded = await generateUpdateList(currentStates, updatedStates);

      // Iterate over updatesNeeded and update the database
      for (const update of updatesNeeded) {
          const machineId = update.machineId; // Assuming each update includes a machineId
          const newData = update.data; // And the new data

          // Perform your database update logic here
          console.log(`Updating record for machine ID: ${machineId}`);
          await client.query('UPDATE machine_status SET data = $1 WHERE machine_id = $2', [JSON.stringify(newData), machineId]);
      }

      client.release(); // Release the client back to the pool

      // Respond with a success message
      res.json({ status: 'success', message: `${updatesNeeded.length} machines updated successfully.` });
  } catch (error) {
      console.error('Error updating machine state:', error);
      res.status(500).send('Error processing request');
  }
});


router.get('/load-machine-state', async (req, res) => {
  try {
      const client = await pool.connect();
      const queryResult = await client.query('SELECT * FROM machine_status');
      const jsonData = queryResult.rows;
      client.release(); // Release the client back to the pool

      res.json(jsonData);
  } catch (err) {
      console.error('Error:', err);
      res.status(500).send('Error loading machine status');
  }
});


router.get('/dc02-hardware-info', async (req, res) => {
  try {
      const client = await pool.connect();
      const queryResult = await client.query('SELECT * FROM dc02_hardware');
      const jsonData = queryResult.rows;
      client.release(); // Release the client back to the pool

      res.json(jsonData);
  } catch (err) {
      console.error('Error:', err);
      res.status(500).send('Error loading machine status');
  }
});

// Registration endpoint
router.post("/register", async (req, res) => {
  const result = "NOT IMPLEMENTED";
  res.status(201).json(result);
});

// Approval endpoint
router.get("/approve/:id", async (req, res) => {
  const result = "NOT IMPLEMENTED";
  res.status(201).json(result);
});

// Login route
router.post("/login", async (req, res) => {
  const { loginIdentifier, password } = req.body;

  try {
    // Query the login_methods table to find the user_id associated with the login identifier
    const loginMethodResult = await pool.query(
      "SELECT user_id FROM login_methods WHERE login_identifier = $1",
      [loginIdentifier]
    );
    const loginMethod = loginMethodResult.rows[0];

    // Check if login identifier exists
    if (!loginMethod) {
      return res.status(404).json({ error: "User not found" });
    }

    // Query the users table to retrieve user information
    const userResult = await pool.query(
      "SELECT * FROM users WHERE user_id = $1",
      [loginMethod.user_id]
    );
    const user = userResult.rows[0];

    // DEBUGGING LINE //////////////////////////////////////
    // console.log(user)
    // console.log(password)
    ////////////////////////////////////////////////////////
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Sign a token. Include a flag in the token payload to indicate if the user is an admin
    const token = jwt.sign(
      { userId: user.user_id, isAdmin: user.is_admin || false },
      REMOVED_JWT_SECRET,
      { expiresIn: "9999 years" }
    );

    // Respond with JWT token and user information
    res.status(200).json({ token, user });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/admin/revoke", async (req, res) => {
  const result = "NOT IMPLEMENTED";
  res.status(201).json(result);
});

// API endpoint to handle logout
router.post("/logout", (req, res) => {
  const token = req.headers["authorization"].split(" ")[1];
  blacklistToken(token);
  res.send("Logged out successfully");
});




export default router;
