import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import isAdmin from '../middlewares/isAdmin.js';
import tryCatch from '../middlewares/tryCatch.js';
import { permissionController } from '../controllers/index.js';
import { WINDOW, MAX_LIMIT } from '../../env.js';

const permissionRoutes = Router();

const limiter = rateLimit({
  windowMs: WINDOW * 1000,
  limit: MAX_LIMIT,
  handler: res => {
    res.status(429).json({ message: `Too many requests to this end-point, please try again after ${WINDOW} seconds` });
  },
});

permissionRoutes.post('/create-permission', [limiter, isAdmin], tryCatch(permissionController.createPermission));
permissionRoutes.get('/get-all-permissions', [limiter, isAdmin], tryCatch(permissionController.getAllPermissions));
permissionRoutes.get('/get-unique-parents', [limiter, isAdmin], tryCatch(permissionController.getUniqueParents));
permissionRoutes.put('/update-permission/:id', [limiter, isAdmin], tryCatch(permissionController.updatePermission));
permissionRoutes.delete('/delete-permission/:id', [limiter, isAdmin], tryCatch(permissionController.deletePermission));

export default permissionRoutes;
