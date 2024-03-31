import express from 'express';
const app = express();
import cors from "cors";


import router from './router.js';

app.use(cors()); // Enable CORS for all routes
app.use(express.json({ limit: '50mb' }));

app.use('/', router);

app.get('/', (req, res) => {
  res.send('hello from express server');
});

export default app;