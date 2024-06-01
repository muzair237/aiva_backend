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
dashboardRoutes.get('/get-recent-queries', [limiter, isAdmin], tryCatch(dashboardController.getRecentQueries));
dashboardRoutes.get('/get-today-query-count', [limiter, isAdmin], tryCatch(dashboardController.getTodayQueryCount));
dashboardRoutes.get('/get-age-groups', [limiter, isAdmin], tryCatch(dashboardController.getAgeGroups));

export default dashboardRoutes;
