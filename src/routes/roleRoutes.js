import { Router } from 'express';
import tryCatch from '../middlewares/tryCatch.js';
import isAdmin from '../middlewares/isAdmin.js';
import rateLimit from 'express-rate-limit';
import { WINDOW, MAX_LIMIT } from '../../env.js';
import { roleController } from '../controllers/index.js';

const limiter = rateLimit({
  windowMs: WINDOW * 1000,
  max: MAX_LIMIT,
  handler: (req, res) => {
    res.status(429).json({ message: `Too many requests to this end-point, please try again after ${WINDOW} seconds` });
  },
});

const regular_handler = (params, req, res, next) => {
  return res.status(params?.code).send(params);
};

const roleRoutes = Router();

roleRoutes.post('/create-role', [limiter, isAdmin], tryCatch(roleController.createRole), regular_handler);
roleRoutes.get('/get-all-roles', [limiter], isAdmin, tryCatch(roleController.getAllRoles), regular_handler);
roleRoutes.put('/update-role/:id', [limiter, isAdmin], tryCatch(roleController.updateRole), regular_handler);
roleRoutes.delete('/delete-role/:id', [limiter, isAdmin], tryCatch(roleController.deleteRole), regular_handler);
roleRoutes.get('/get-permissions', [limiter, isAdmin], tryCatch(roleController.getPermissions), regular_handler);

export default roleRoutes;
