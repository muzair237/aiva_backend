import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
<<<<<<< HEAD
<<<<<<< HEAD
import isAdmin from '../middlewares/isAdmin.js';
=======
import isUser from '../middlewares/isUser.js';
>>>>>>> 9e73c4295a0c3aea6fc46aebfa219e10fce6238f
=======
import isUser from '../middlewares/isUser.js';
>>>>>>> 5029048b46d87a31cb4a569052fc786d1daceaa9
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
