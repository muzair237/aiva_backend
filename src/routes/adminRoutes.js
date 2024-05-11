import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import isAdmin from '../middlewares/isAdmin.js';
import tryCatch from '../middlewares/tryCatch.js';
import { adminController } from '../controllers/index.js';
import { WINDOW, MAX_LIMIT } from '../../env.js';

const adminRoutes = Router();

const limiter = rateLimit({
  windowMs: WINDOW * 1000,
  limit: MAX_LIMIT,
  handler: res => {
    res.status(429).json({ message: `Too many requests to this end-point, please try again after ${WINDOW} seconds` });
  },
});

adminRoutes.post('/login', [limiter], tryCatch(adminController.login));
adminRoutes.get('/logout', [isAdmin, limiter], tryCatch(adminController.logout));
adminRoutes.get('/get-all-admins', [isAdmin, limiter], tryCatch(adminController.getAllAdmins));
adminRoutes.get('/get-unique-roles', [isAdmin, limiter], tryCatch(adminController.getUniqueRoles));
adminRoutes.post('/create-admin', [isAdmin, limiter], tryCatch(adminController.createAdmin));
adminRoutes.put('/update-admin/:id', [isAdmin, limiter], tryCatch(adminController.updateAdmin));
adminRoutes.delete('/delete-admin/:id', [isAdmin, limiter], tryCatch(adminController.deleteAdmin));

export default adminRoutes;
