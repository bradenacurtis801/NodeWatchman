import config from './config.js';
import Api from './api.js';

// Regular expressions for validation
const regexPatterns = {
    apiKey: /^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/, // UUID format
    apiSecret: /^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{20}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/, // Corrected format for apiSecret
    orgId: /^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/, // UUID format
};

// Example formats for each config entry (for developer reference)
const exampleFormats = {
    apiHost: ['https://api-test.nicehash.com', 'https://api2.nicehash.com'], // Both test and production URLs
    apiKey: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', // Example format: UUID
    apiSecret: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxxxxxxxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', // Example complex structure
    orgId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', // Example format: UUID
};

console.log(config); // Output the current configuration

// Function to validate config values
const validateConfig = (config) => {
    for (const key in config) {
        if (!config[key]) {
            throw new Error(`Value for ${key} in config cannot be blank.`);
        } else if (key === 'apiHost') {
            if (!exampleFormats.apiHost.includes(config[key])) {
                console.log('\x1b[33m%s\x1b[0m', 'WARNING: Production URL is being used.');
                throw new Error(`Invalid value for ${key} in config. Expected formats: ${exampleFormats.apiHost.join(' or ')}`);
            }
        } else if (!(key in regexPatterns) || !regexPatterns[key].test(config[key])) {
            throw new Error(`Invalid value for ${key} in config. Expected format: ${exampleFormats[key]}`);
        }
    }
};

validateConfig(config); // Validate the config upon running the script

const api = new Api(config);

// Function to fetch mining groups list
const getRigStatus = async () => {
    try {
        // Ensure server time is fetched first
        await api.getTime();

        // Call the mining groups list API
        const res = await api.get('/main/api/v2/mining/groups/list');

        // Log the response for debugging
        log('Mining groups list:', res);

        // Return the response
        return res;
    } catch (err) {
        // Handle errors
        if (err && err.response) {
            log(err.response.request.method, err.response.request.uri.href);
        }
        log('ERROR', err.error || err);
        throw err; // Re-throw the error to propagate it
    }
};

console.log(getRigStatus())