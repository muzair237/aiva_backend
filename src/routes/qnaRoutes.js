import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
// import isUser from '../middlewares/isAdmin.js';
import isAdmin from '../middlewares/isAdmin.js';
import tryCatch from '../middlewares/tryCatch.js';
import { QnAController } from '../controllers/index.js';
import { WINDOW, MAX_LIMIT } from '../../env.js';

const QnARoutes = Router();

const limiter = rateLimit({
  windowMs: WINDOW * 1000,
  limit: MAX_LIMIT,
  handler: res => {
    res.status(429).json({ message: `Too many requests to this end-point, please try again after ${WINDOW} seconds` });
  },
});

QnARoutes.get(
  '/restore-QnA',
  [
    limiter,
    // isUser
  ],
  tryCatch(QnAController.restoreQnA),
);
QnARoutes.get('/get-all-questions', [limiter, isAdmin], tryCatch(QnAController.getAllQuestions));

export default QnARoutes;
