import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import isAdmin from '../middlewares/isAdmin.js';
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
userRoutes.post('/signUp', [limiter], tryCatch(userController.signUp));
userRoutes.post('/send-otp', [limiter], tryCatch(userController.sendOTP));
userRoutes.post('/verify-otp', [limiter], tryCatch(userController.verifyOTP));
userRoutes.post('/update-password', [limiter], tryCatch(userController.updatePassword));
userRoutes.get('/get-all-users', [limiter, isAdmin], tryCatch(userController.getAllUsers));
userRoutes.get('/logout', [limiter, isUser], tryCatch(userController.logout));

export default userRoutes;
