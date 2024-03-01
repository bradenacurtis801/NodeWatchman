const os = require('os');
const express = require('express');
const bodyParser = require('body-parser');
const { spawn } = require('child_process'); 
const cors = require('cors');
const { exec } = require('child_process');

// Check if the script is running in WSL by checking for WSL-specific environment variables
// const isWSL = process.env.WSL_DISTRO_NAME;

// if (!isWSL && os.platform() !== 'linux') {
//   console.error('Error: This script must be run in a Linux terminal or a WSL environment.');
//   process.exit(1); // Exit the script with an error code
// }

const app = express();
app.use(express.json()); // For parsing application/json
const port = 5000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes



// POST endpoint to execute the script
app.post('/execute-script', async (req, res) => {
    const { ips, script } = req.body;
    if (!ips || !script) {
        return res.status(400).send('IP addresses or script missing');
    }

    // Assuming the script is now located within the public directory or correctly accessible
    const scriptPath = '../BashScripts/execute_on_machines.sh';

    console.log('running ssh command');
    const childProcess = spawn('bash', [scriptPath, ips, script]);
    let jsonOutput = []; // Store JSON data

    try {
        for await (const data of childProcess.stdout) {
            console.log(`stdout: ${data}`);
            try {
                const json = JSON.parse(data); // Try parsing the data as JSON
                // Filter out empty JSON objects
                if (Object.keys(json).length > 0) {
                    jsonOutput.push(json); // Parse JSON data
                }
            } catch (error) {
                // Handle non-JSON data (regular output) here
                console.error('Error parsing JSON:', error);
            }
        }
    } catch (error) {
        console.error('Error reading stdout:', error);
    }

    childProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
        // Optionally handle errors differently
    });

    childProcess.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        // Send the JSON data back as the response
        res.json(jsonOutput);
    });

    childProcess.on('error', (error) => {
        console.error(`exec error: ${error}`);
        res.status(500).json({ error: `Script execution error: ${error.message}` });
    });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${port}`);
});
