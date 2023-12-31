const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');

// Enable CORS for all routes
app.use(cors());
// Serve static files from the 'FrontEnd' directory
app.use(express.static(path.join(__dirname, '.')));

// Route to serve the home.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
});

const PORT = 5500;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

