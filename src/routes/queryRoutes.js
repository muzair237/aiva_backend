import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import isUser from '../middlewares/isUser.js';
import tryCatch from '../middlewares/tryCatch.js';
import { queryController } from '../controllers/index.js';
import { WINDOW, MAX_LIMIT } from '../../env.js';

const queryRoutes = Router();

const limiter = rateLimit({
  windowMs: WINDOW * 1000,
  limit: MAX_LIMIT,
  handler: res => {
    res.status(429).json({ message: `Too many requests to this end-point, please try again after ${WINDOW} seconds` });
  },
});

queryRoutes.post(
  '/ask-query',
  [
    // isUser,
    limiter,
  ],
  tryCatch(queryController.askQuery),
);

export default queryRoutes;
