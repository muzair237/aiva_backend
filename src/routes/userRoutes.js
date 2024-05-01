import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import isUser from '../middlewares/isUser.js';
import tryCatch from '../middlewares/tryCatch.js';
import { userController } from '../controllers/index.js';
import { WINDOW, MAX_LIMIT } from '../../env.js';

const userRoutes = Router();

const limiter = rateLimit({
  windowMs: WINDOW * 1000,
  limit: MAX_LIMIT,
  handler: res => {
    res.status(429).json({ message: `Too many requests to this end-point, please try again after ${WINDOW} seconds` });
  },
});

userRoutes.post('/login', [limiter], tryCatch(userController.login));
userRoutes.get('/logout', [isUser, limiter], tryCatch(userController.logout));

export default userRoutes;
