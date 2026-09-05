import express from 'express';
import { analyzeResume, getAnalysisHistory, getAnalysisById } from '../controllers/analyzerController.js';
import { uploadResume } from '../middleware/uploadMiddleware.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Allow scan with or without login (guests supported)
router.post('/scan', optionalAuth, uploadResume.single('resume'), analyzeResume);
router.get('/history', protect, getAnalysisHistory);
router.get('/:id', optionalAuth, getAnalysisById);

export default router;
