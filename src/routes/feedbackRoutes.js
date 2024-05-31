import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import isAdmin from '../middlewares/isAdmin.js';
import isUser from '../middlewares/isUser.js';
import tryCatch from '../middlewares/tryCatch.js';
import { feedbackController } from '../controllers/index.js';
import { WINDOW, MAX_LIMIT } from '../../env.js';

const feedbackRoutes = Router();

const limiter = rateLimit({
  windowMs: WINDOW * 1000,
  limit: MAX_LIMIT,
  handler: res => {
    res.status(429).json({ message: `Too many requests to this end-point, please try again after ${WINDOW} seconds` });
  },
});

feedbackRoutes.post('/create-feedback', [limiter], tryCatch(feedbackController.createFeedback));
feedbackRoutes.get('/get-all-feedbacks', [limiter, isAdmin], tryCatch(feedbackController.getAllFeedback));

export default feedbackRoutes;
