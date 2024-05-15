import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import isAdmin from '../middlewares/isAdmin.js';
import tryCatch from '../middlewares/tryCatch.js';
import { dashboardController } from '../controllers/index.js';
import { WINDOW, MAX_LIMIT } from '../../env.js';

const dashboardRoutes = Router();

const limiter = rateLimit({
  windowMs: WINDOW * 1000,
  limit: MAX_LIMIT,
  handler: res => {
    res.status(429).json({ message: `Too many requests to this end-point, please try again after ${WINDOW} seconds` });
  },
});

dashboardRoutes.get('/get-all-dashboard-cards', [limiter, isAdmin], tryCatch(dashboardController.getDashboardCards));

export default dashboardRoutes;
