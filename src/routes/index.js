import { Router } from 'express';
import adminRoutes from './adminRoutes.js';
import permissionRoutes from './permissionRoutes.js';

const router = Router();

router.use('/admin', adminRoutes);
router.use('/permission', permissionRoutes);

export default router;
