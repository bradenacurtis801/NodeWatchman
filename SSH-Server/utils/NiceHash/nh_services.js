import config from './config.js';
import Api from './api.js';
import { ConsoleMessage } from 'puppeteer';

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


// Function to validate config values
const validateConfig = (config) => {
    for (const section in config) {
        const sectionConfig = config[section];
        for (const key in sectionConfig) {
            const value = sectionConfig[key];
            if (!value) {
                throw new Error(`Value for ${key} in ${section} config cannot be blank.`);
            } else if (key === 'apiHost') {
                if (!exampleFormats.apiHost.includes(value)) {
                    console.log('\x1b[33m%s\x1b[0m', 'WARNING: Production URL is being used.');
                    throw new Error(`Invalid value for ${key} in ${section} config. Expected formats: ${exampleFormats.apiHost.join(' or ')}`);
                }
            } else if (!(key in regexPatterns) || !regexPatterns[key].test(value)) {
                throw new Error(`Invalid value for ${key} in ${section} config. Expected format: ${exampleFormats[key]}`);
            }
        }
    }
};

validateConfig(config); // Validate the config upon running the script

const api = new Api(config.PRIVELEGED);
console.log(config.PRIVELEGED);
var log = function () {
	return console.log(...arguments);
}

// Function to fetch mining groups list
export const getRigStatus = async () => {
    try {
        // Ensure server time is fetched first
        await api.getTime();

        // Call the mining groups list API
        const res = await api.get('/main/api/v2/mining/groups/list');

        // Log the response for debugging
        // log('Mining groups list:', res);
        // Assuming the structure is as shown in your log
        const rigs = res.groups[''].rigs;

        // Log the rigs array
        // console.log('Rigs:', rigs);
        
        // Return the response
        return rigs;
    } catch (err) {
        // Handle errors
        if (err && err.response) {
            log(err.response.request.method, err.response.request.uri.href);
        }
        log('ERROR', err.error || err);
        throw err; // Re-throw the error to propagate it
    }
};

export const hideRig = async (rigId) => {
    try {
        // Ensure server time is fetched first
        await api.getTime();

        // Now that we have the server time, make the POST call to hide the rig
        const res = await api.post(`/main/api/v2/mining/rig/${rigId}/hide`);
        return res;
    } catch (err) {
        // Handle errors
        console.error('Error hiding rig:', err);
        throw err;
    }
};

export const delete_offline_all = async () => {
    try {
        const rigs = await getRigStatus();
        
        const offlineRigIds = rigs
            .filter(rig => rig.status === 'OFFLINE')
            .map(rig => rig.rigId);

        for (const rigId of offlineRigIds) {
            await hideRig(rigId);
            console.log(`Rig with ID ${rigId} has been hidden.`);
        }

        console.log('All offline rigs have been hidden.');
    } catch (err) {
        console.error('Failed to delete offline rigs:', err);
    }
};



// getRigStatus().then(result => console.log(result)).catch(err => console.error(err));
// Call hideRig function
// hideRig('0-oNEQj5eXUkKrCmM25iy56A')
//     .then(result => console.log('Rig hidden:', result))
//     .catch(err => console.error('Failed to hide rig:', err));
delete_offline_all();