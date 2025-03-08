import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import tryCatch from '../middlewares/tryCatch.js';
import { generalController } from '../controllers/index.js';
import { WINDOW, MAX_LIMIT } from '../../env.js';

const generalRoutes = Router();

const limiter = rateLimit({
  windowMs: WINDOW * 1000,
  limit: MAX_LIMIT,
  handler: res => {
    res.status(429).json({ message: `Too many requests to this end-point, please try again after ${WINDOW} seconds` });
  },
});

generalRoutes.post('/send-me-email', [limiter], tryCatch(generalController.sendMeEmail));

export default generalRoutes;
