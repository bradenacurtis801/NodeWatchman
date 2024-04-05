// CHECK IF COMPUTER OS IS COMPATIBLE
//////////////////////////////////////////////////
import checkOS from '../Utils/chk_os.js';

checkOS();

//////////////////////////////////////////////////

import config from '../Config/config.js';

checkOS();

import express from 'express';
import path from 'path';
const app = express();
import cors from 'cors';
import { fileURLToPath } from 'url';

app.use(cors()); // Enable CORS for all routes

// Get the directory name using import.meta.url
const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
console.log('server.js dir:', path.join(__dirname, 'public'))

// Route to serve the home.html file
app.get('/', (req, res) => {
   // res.redirect('/LoginPage/login.html');
   res.redirect('/MachineControlPanelPage/machine-control-panel.html');
});


app.listen(config.FRONTEND_SERVER_PORT, () => {
    console.log(`Server started on port ${config.FRONTEND_SERVER_PORT}`);
});
