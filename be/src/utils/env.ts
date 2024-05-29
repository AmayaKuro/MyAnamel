const MONGO_URI = process.env.MONGO_URI || 'not now';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

const CURRENT_SEASON = parseInt(process.env.CURRENT_SEASON || "1") || 1;

export { MONGO_URI, FRONTEND_URL, CURRENT_SEASON };