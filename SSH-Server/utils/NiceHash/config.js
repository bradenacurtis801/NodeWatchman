import dotenv from "dotenv";
dotenv.config();

// Function to validate that environment variables are not empty
const validateEnvVariables = () => {
    const requiredEnv = {
        NH_API_HOST: process.env.NH_API_HOST, 
        NH_API_KEY: process.env.NH_API_KEY,
        NH_API_SECRET: process.env.NH_API_SECRET,
        NH_ORG_ID: process.env.NH_ORG_ID
    };

    for (const [key, value] of Object.entries(requiredEnv)) {
        if (!value) {
            throw new Error(`Environment variable ${key} is missing or empty. Please check your .env file.`);
        }
    }
}

// Validate environment variables before proceeding
validateEnvVariables();

// If validation passes, export the configuration
export default {
    apiHost: process.env.NH_API_HOST, 
    apiKey: process.env.NH_API_KEY,
    apiSecret: process.env.NH_API_SECRET,
    orgId: process.env.NH_ORG_ID
}
