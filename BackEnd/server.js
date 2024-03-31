// CHECK IF COMPUTER OS IS COMPATIBLE
//////////////////////////////////////////////////
import checkOS from '../Utils/chk_os.js';

checkOS();
//////////////////////////////////////////////////
console.log("Current Working Directory:", process.cwd());

import 'dotenv/config';
import app from './app.js';
import runDbMigrations from './db/migrations/index.js';
import config from '../Config/config.js';
async function start() {
    await runDbMigrations();
    app.listen(config.BACKEND_SERVER_PORT, '0.0.0.0', () => console.log(`Server started on port ${config.BACKEND_SERVER_PORT}`));
}

start();