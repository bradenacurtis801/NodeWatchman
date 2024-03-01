const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');

// Enable CORS for all routes
app.use(cors({
  origin: '*',
}));

// Serve static files from the 'FrontEnd' directory
app.use(express.static(path.join(__dirname, '.')));
app.use(express.static('public'))

// Route to serve the home.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/test.html'));
});

const PORT = 5500;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
