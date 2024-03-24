const os = require('os');

function checkOS() {
  const operatingSystem = os.type();

  if (operatingSystem === 'Linux') {
    console.log(`The operating system is: ${operatingSystem}`);
  } else {
    throw new Error('This script is only supported on Linux operating systems.');
  }
}
checkOS();

const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');

app.use(cors()); // Enable CORS for all routes
// Serve static files from the 'FrontEnd' directory
app.use(express.static(path.join(__dirname, '.')));
app.use(express.static('public'))
app.use(express.static('public/LandingPage'))
console.log(path.join(__dirname, '.'))
// Route to serve the home.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/LandingPage/testLandingPage.html'));
});

const PORT = 5501;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
