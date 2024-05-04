/* eslint-disable no-undef */
await import('dotenv');

export const PORT = process.env.PORT || 4001;
export const MONGO_STRING = process.env.MONGO_STRING || '';
export const FRONTEND_URL = process.env.FRONTEND_URL || '';
export const BACKEND_URL = process.env.BACKEND_URL || '';
export const SECRET = process.env.SECRET || '';
export const EMAIL_USER = process.env.EMAIL_USER || '';
export const EMAIL_PASS = process.env.EMAIL_PASS || '';
export const WINDOW = process.env.WINDOW || '';
export const MAX_LIMIT = process.env.MAX_LIMIT || '';
