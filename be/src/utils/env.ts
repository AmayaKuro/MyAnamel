const ENV = process.env.NODE_ENV || 'development';

const MONGO_URI = process.env.MONGO_URI || 'not now';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

const CURRENT_SEASON = parseInt(process.env.CURRENT_SEASON || "1") || 1;

const SECRET_KEY = process.env.SECRET_KEY || '';

const OPHIM_URL = process.env.OPHIM_URL || 'https://ophim1.com';

export { ENV, MONGO_URI, FRONTEND_URL, CURRENT_SEASON, SECRET_KEY, OPHIM_URL };