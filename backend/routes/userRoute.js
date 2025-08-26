import express from 'express';
import { createTestUser, getAllUsers, getUserSavedPosts, savePost } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/saved', getUserSavedPosts);
router.patch('/save', savePost);
router.post('/test', createTestUser);
router.get('/all', getAllUsers);

export default router;
