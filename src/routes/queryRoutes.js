import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import isAdmin from '../middlewares/isAdmin.js';
import tryCatch from '../middlewares/tryCatch.js';
import { userQuery } from '../controllers/index.js';
import { WINDOW, MAX_LIMIT } from '../../env.js';

const adminRoutes = Router();

const limiter = rateLimit({
  windowMs: WINDOW * 1000,
  limit: MAX_LIMIT,
  handler: res => {
    res.status(429).json({ message: `Too many requests to this end-point, please try again after ${WINDOW} seconds` });
  },
});

adminRoutes.post('/query', [limiter], tryCatch(userQuery.query));

export default adminRoutes;
