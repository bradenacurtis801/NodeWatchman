const fs = require('fs');
const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' })



// Read JSON data from file
const jsonData = fs.readFileSync('DC02_HARDWARE_INFO_ALL.json', 'utf8');

// Parse JSON data into JavaScript objects
const data = JSON.parse(jsonData);

// Configure the PostgreSQL connection pool
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432, // PostgreSQL default port
    ssl: false // Set to true if using SSL
});

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
