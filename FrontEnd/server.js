// CHECK IF COMPUTER OS IS COMPATIBLE
//////////////////////////////////////////////////
const checkOS = require('../Utils/chk_os.js');
checkOS();
//////////////////////////////////////////////////

const config = require('../Config/config.js');

checkOS();

const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');

app.use(cors()); // Enable CORS for all routes

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
console.log('server.js dir:', __dirname)

// Route to serve the home.html file
app.get('/', (req, res) => {
    res.redirect('/LoginPage/login.html');
});


app.listen(config.FRONTEND_SERVER_PORT, () => {
    console.log(`Server running on http://localhost:${config.FRONTEND_SERVER_PORT}`);
});
