import { Router } from 'express';
import dashboardRoutes from './dashboardRoutes.js';
import adminRoutes from './adminRoutes.js';
import permissionRoutes from './permissionRoutes.js';
import roleRoutes from './roleRoutes.js';
import QnARoutes from './qnaRoutes.js';
import userRoutes from './userRoutes.js';
import feedbackRoutes from './feedbackRoutes.js';
import queryRoutes from './queryRoutes.js';

const router = Router();

router.use('/dashboard', dashboardRoutes);
router.use('/admin', adminRoutes);
router.use('/userQuery', QnARoutes);
router.use('/permission', permissionRoutes);
router.use('/role', roleRoutes);
router.use('/QnA', QnARoutes);
router.use('/user', userRoutes);
router.use('/feedback', feedbackRoutes);
router.use('/query', queryRoutes);

export default router;
