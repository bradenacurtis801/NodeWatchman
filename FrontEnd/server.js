const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');

app.use(cors()); // Enable CORS for all routes
// Serve static files from the 'FrontEnd' directory
app.use(express.static(path.join(__dirname, '.')));
app.use(express.static('public'))

// Route to serve the home.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/interact.html'));
});

const PORT = 5501;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
