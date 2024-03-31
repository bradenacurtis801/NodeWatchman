import db from '../db.js';
import { createApprovalTable, createDC02Table, createMachineStatusTable, createLoginMethodTable, createUsersTable } from './createTables.js';

const runDbMigrations = async () => {
    console.log('BEGIN DB MIGRATION');
  
    // Use single client for transactions
    const client = await db.connect();
  
    try {
        await client.query('BEGIN'); // Begin transaction
  
        // Execute table creation queries
        await client.query(createApprovalTable);
        await client.query(createDC02Table);
        await client.query(createMachineStatusTable);
        await client.query(createLoginMethodTable);
        await client.query(createUsersTable);
  
        await client.query('COMMIT'); // Commit transaction
        console.log('END DB MIGRATION');
    } catch (e) {
        await client.query('ROLLBACK'); // Rollback transaction
        console.log('DB migration failed:', e.message);
        throw e; // Rethrow the error to handle it elsewhere if needed
    } finally {
        client.release(); // Release the client back to the pool
    }
};

export default runDbMigrations;
