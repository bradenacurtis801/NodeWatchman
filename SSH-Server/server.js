const os = require('os');
const express = require('express');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs').promises; // Import the fs module at the top of your script


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

// POST endpoint to execute the script
app.post('/execute-script', async (req, res) => {
    const { ips, script } = req.body;
    if (!ips || !script) {
        return res.status(400).send('IP addresses or script missing');
    }

    const scriptPath = '../BashScripts/execute_on_machines.sh';
    console.log('running ssh command');
    const childProcess = spawn('bash', [scriptPath, ips, script]);
    let rawData = ''; // Accumulate data here

    childProcess.stdout.on('data', (data) => {
        rawData += data.toString(); // Accumulate data as a string.
    });

    childProcess.on('close', (code) => {
        console.log(`child process exited with code ${code}`);

        // Directly parse the rawData as JSON
        try {
            let jsonOutput = JSON.parse(rawData);

            // Optionally, sort the JSON data by IP address numerically
            jsonOutput.sort((a, b) => {
                const ipSegmentsA = a.ip.split('.').map(Number);
                const ipSegmentsB = b.ip.split('.').map(Number);

                for (let i = 0; i < ipSegmentsA.length; i++) {
                    if (ipSegmentsA[i] < ipSegmentsB[i]) {
                        return -1;
                    } else if (ipSegmentsA[i] > ipSegmentsB[i]) {
                        return 1;
                    }
                }
                return 0;
            });

            // Define the filename for the output JSON file
            const outputFilename = './output.json';

            // Use fs.promises.writeFile to write the result to a JSON file in the current directory
            fs.writeFile(outputFilename, JSON.stringify(jsonOutput, null, 2), 'utf8')
              .then(() => {
                  console.log(`Output written to ${outputFilename}`);
                  res.json(jsonOutput); // Send the sorted JSON data back as the response
              })
              .catch((error) => {
                  console.error('Error writing file:', error);
                  res.status(500).json({ error: 'Error writing output file' });
              });

        } catch (error) {
            console.error('Error parsing JSON:', error, 'From rawData:', rawData);
            res.status(500).json({ error: 'Error parsing script output as JSON' });
        }
    });

    childProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    childProcess.on('error', (error) => {
        console.error(`exec error: ${error}`);
        res.status(500).json({ error: `Script execution error: ${error.message}` });
    });
});


app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${port}`);
});

