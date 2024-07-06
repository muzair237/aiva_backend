import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import isAdmin from '../middlewares/isAdmin.js';
import isUser from '../middlewares/isUser.js';
import tryCatch from '../middlewares/tryCatch.js';
import { enquiryController } from '../controllers/index.js';
import { WINDOW, MAX_LIMIT } from '../../env.js';

const enquiryRoutes = Router();

const limiter = rateLimit({
  windowMs: WINDOW * 1000,
  limit: MAX_LIMIT,
  handler: res => {
    res.status(429).json({ message: `Too many requests to this end-point, please try again after ${WINDOW} seconds` });
  },
});

enquiryRoutes.post('/create-enquiry', [limiter], tryCatch(enquiryController.createEnquiry));
// enquiryRoutes.get('/get-all-feedbacks', [limiter, isAdmin], tryCatch(feedbackController.getAllFeedback));

export default enquiryRoutes;
