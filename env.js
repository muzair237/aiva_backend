/* eslint-disable no-undef */
await import('dotenv');

export const PORT = process.env.PORT;
export const MONGO_STRING = process.env.MONGO_STRING || '';
export const FRONTEND_ADMIN_URL = process.env.FRONTEND_ADMIN_URL || '';
export const FRONTEND_USER_URL = process.env.FRONTEND_USER_URL || '';
export const SECRET = process.env.SECRET || '';
export const EMAIL_USER = process.env.EMAIL_USER || '';
export const EMAIL_PASS = process.env.EMAIL_PASS || '';
export const WINDOW = process.env.WINDOW || '';
export const MAX_LIMIT = process.env.MAX_LIMIT || '';
export const CLOUD_NAME = process.env.CLOUD_NAME || '';
export const API_KEY = process.env.API_KEY || '';
export const API_SECRET = process.env.API_SECRET || '';
