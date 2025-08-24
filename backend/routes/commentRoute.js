import express from 'express';
import { addComment,
     deleteComment,
      getPostComments,
    likeComment,       // Add this
     getCommentLikes
     } from '../controllers/comment.controller.js';

const router = express.Router();

router.get('/:postId', getPostComments)
router.post('/:postId',addComment )
router.delete('/:id', deleteComment )
router.patch('/:id/like', likeComment);     
router.get('/:id/likes', getCommentLikes);     

export default router;