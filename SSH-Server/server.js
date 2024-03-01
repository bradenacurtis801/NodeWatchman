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
app.post('/execute-script', (req, res) => {
    const { ips, script } = req.body;
    if (!ips || !script) {
        return res.status(400).send('IP addresses or script missing');
    }

    // Assuming the script is now located within the public directory or correctly accessible
    const scriptPath = '../BashScripts/execute_on_machines.sh';
    // Prepare to stream the response
    res.writeHead(200, {
        "Content-Type": "text/plain",
        "Transfer-Encoding": "chunked",
    });

    console.log('running ssh command');
    const childProcess = spawn('bash', [scriptPath, ips, script]);

    childProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
        res.write(data); // Send chunks of data as they come
    });

    childProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
        res.write(`Error: ${data}`); // Optionally handle errors differently
    });

    childProcess.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        res.end(); // Close the response stream
    });

    childProcess.on('error', (error) => {
        console.error(`exec error: ${error}`);
        res.status(500).send(`Script execution error: ${error.message}`);
    });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${port}`);
});
