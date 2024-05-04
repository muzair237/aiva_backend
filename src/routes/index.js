import { Router } from 'express';
import adminRoutes from './adminRoutes.js';
import permissionRoutes from './permissionRoutes.js';
import QnARoutes from './qnaRoutes.js';
import userRoutes from './userRoutes.js';
import feedbackRoutes from './feedbackRoutes.js';

const router = Router();

router.use('/admin', adminRoutes);
router.use('/permission', permissionRoutes);
router.use('/QnA', QnARoutes);
router.use('/user', userRoutes);
router.use('/feedback', feedbackRoutes);

export default router;
