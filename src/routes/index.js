import { Router } from 'express';
import userRoutes from './userRoutes.js';
import permissionRoutes from './permissionRoutes.js';

const router = Router();

router.use('/user', userRoutes);
router.use('/permission', permissionRoutes);

export default router;
