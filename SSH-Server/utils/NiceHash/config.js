import dotenv from "dotenv";
dotenv.config();

export default {
	apiHost: process.env.NH_API_HOST, 
	apiKey: process.env.NH_API_KEY,
	apiSecret: process.env.NH_API_SECRET,
	orgId: process.env.NH_ORG_ID
}