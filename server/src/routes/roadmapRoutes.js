import express from 'express';
import { getRoadmapById, getUserRoadmaps, toggleMilestone } from '../controllers/roadmapController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/user/me', protect, getUserRoadmaps);
router.get('/:id', optionalAuth, getRoadmapById);
router.patch('/:id/milestones/:phaseIndex/:milestoneIndex', optionalAuth, toggleMilestone);

export default router;
