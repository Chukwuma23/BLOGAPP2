import express from 'express';
import {
    getPosts,
    getPost,
    getPostById, 
    createPost,
    updatePost,
    deletePost,
    uploadAuth,
    featurePost,
    likePost,
    getPostLikes
  } from '../controllers/post.controller.js';
import increaseVisit from '../middlwares/increaseVisit.js';

const router = express.Router();

router.use('/upload-auth', uploadAuth); // Apply uploadAuth middleware to all routes in this router
router.get('/', getPosts);
router.get('/:slug', increaseVisit, getPost);
router.post('/', createPost);
router.delete('/:id', deletePost);
router.patch('/feature', featurePost);
router.put('/:id', updatePost);
router.get('/id/:id', getPostById);
router.patch('/:id/like', likePost);   
router.get('/:id/likes', getPostLikes);   
export default router;