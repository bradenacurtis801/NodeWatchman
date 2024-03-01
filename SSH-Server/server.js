const os = require('os');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { exec } = require('child_process');

// Check if the script is running in WSL by checking for WSL-specific environment variables
const isWSL = process.env.WSL_DISTRO_NAME;

if (!isWSL && os.platform() !== 'linux') {
  console.error('Error: This script must be run in a Linux terminal or a WSL environment.');
  process.exit(1); // Exit the script with an error code
}

const app = express();
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

  // Path to your bash script
  const scriptPath = '../BashScripts/execute_on_machines.sh';

  // Use a more generalized command without assuming WSL's 'wsl' prefix
  // as we're now checking for a WSL environment beforehand.
  exec(`bash ${scriptPath} "${ips}" "${script}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).send(`Script execution error: ${error.message}`);
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
    res.send({ message: 'Script executed successfully', stdout, stderr });
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${port}`);
});
