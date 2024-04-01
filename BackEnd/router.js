import { Router } from "express";
import authenticateToken from "./auth/auth.js";
import fs from "fs/promises"; // Import fs using promise-based API
import cors from "cors";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config({ path: './.env' })
import jwt from "jsonwebtoken";
import pool from "./db/db.js";

const REMOVED_JWT_SECRET = process.env.REMOVED_JWT_SECRET;
const router = Router();

router.post("/save-machine-state", async (req, res) => {
  const result = "NOT IMPLEMENTED";
  res.status(201).json(result);
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
  console.log('here')
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

router.post("/interact/update-machine-state", async (req, res) => {
  const result = "NOT IMPLEMENTED";
  res.status(201).json(result);
});

router.get("/interact/load-machine-state", async (req, res) => {
  const result = "NOT IMPLEMENTED";
  res.status(201).json(result);
});

router.get("/interact/dc02-hardware-info", async (req, res) => {
  const result = "NOT IMPLEMENTED";
  res.status(201).json(result);
});

export default router;
