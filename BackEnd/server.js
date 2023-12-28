const express = require('express');
const fs = require('fs');
const cors = require('cors');
const machineStateFile = 'machineState.json';

const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(express.json());

app.post('/save-machine-state', (req, res) => {
    fs.writeFile(machineStateFile, JSON.stringify(req.body), err => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error saving state');
        }
        res.send({ status: 'success' });
    });
});

app.get('/load-machine-state', (req, res) => {
    fs.readFile(machineStateFile, 'utf8', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // File not found, send empty object
                console.log('No existing state file. Sending empty state.');
                return res.json({ boxStates: {} });
            } else {
                console.error('Error reading state file:', err);
                return res.status(500).send('Error loading state');
            }
        }

        try {
            // Handle empty file scenario
            if (data === '') {
                console.log('State file empty. Sending empty state.');
                return res.json({ boxStates: {} });
            }

            const jsonData = JSON.parse(data);
            res.json(jsonData);
        } catch (parseErr) {
            console.error('Error parsing state file:', parseErr);
            res.status(500).send('Error parsing state file');
        }
    });
});



app.listen(3000, () => console.log('Server started on port 3000'));
