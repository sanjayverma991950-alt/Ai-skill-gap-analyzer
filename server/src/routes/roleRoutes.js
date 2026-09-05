import express from 'express';
import { getRoles, getRoleBySlug } from '../controllers/roleController.js';

const router = express.Router();

router.get('/', getRoles);
router.get('/:slug', getRoleBySlug);

export default router;
