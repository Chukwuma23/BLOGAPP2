import express from 'express';
import { addComment,
     deleteComment,
      getPostComments,
    likeComment,       // Add this
     getCommentLikes,
     getCommentCount
     } from '../controllers/comment.controller.js';

const router = express.Router();


// commentsRoute.js - CORRECT ORDER
router.get('/:id/comment-count', getCommentCount)      // Specific first
router.get('/:id/likes', getCommentLikes)              // Specific first
router.patch('/:id/like', likeComment)                 // Specific first
router.delete('/:id', deleteComment)                   // Generic later
router.get('/:postId', getPostComments)                // Generic last
router.post('/:postId', addComment)                    // Generic last
export default router;