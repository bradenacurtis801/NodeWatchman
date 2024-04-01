import fs from 'fs';
import pool from "./db.js";
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' })



// Read JSON data from file
const jsonData = fs.readFileSync('interactive_nodes.json', 'utf8');

// Parse JSON data into JavaScript objects
const data = JSON.parse(jsonData);

// Function to insert data into the PostgreSQL database
async function insertData() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Insert data into the database
        for (const entry of data) {
            const machineId = Object.keys(entry)[0]; // Extract machine_id
            const status = JSON.stringify(entry[machineId]); // Convert status to JSON string
            await client.query('INSERT INTO dc02_hardware (machine_id, status) VALUES ($1, $2)', [machineId, status]);
        }

        await client.query('COMMIT');
        console.log('Data inserted successfully');
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error inserting data:', error);
    } finally {
        client.release();
        await pool.end();
    }
}

// Call the function to insert data
insertData();
