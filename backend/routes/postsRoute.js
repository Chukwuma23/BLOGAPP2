import express from 'express';
import {
    getPosts,
    getPost,
    createPost,
    deletePost,
    uploadAuth
  } from '../controllers/post.controller.js';

const router = express.Router();

router.use('/upload-auth', uploadAuth); // Apply uploadAuth middleware to all routes in this router
router.get('/', getPosts);
router.get('/:slug', getPost);
router.post('/', createPost);
router.delete('/:id', deletePost);

export default router;