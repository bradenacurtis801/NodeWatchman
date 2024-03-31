const { Pool } = require('pg');

// Configure the PostgreSQL connection pool
const pool = new Pool({
    user: 'your_username',
    host: 'your_database_host',
    database: 'your_database_name',
    password: 'your_database_password',
    port: 5432, // PostgreSQL default port
    ssl: false // Set to true if using SSL
});

// Export the connection pool
module.exports = pool;
