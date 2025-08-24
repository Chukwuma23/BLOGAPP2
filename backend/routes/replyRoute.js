// routes/replyRoute.js
import express from 'express';
import { 
  getReplies, 
  addReply, 
  deleteReply,
  likeReply,     
  getReplyLikes 
} from '../controllers/replyController.js';

const router = express.Router();

router.get('/:commentId', getReplies);
router.post('/:commentId', addReply);
router.delete('/:id', deleteReply);
router.patch('/:id/like', likeReply);  
router.get('/:id/likes', getReplyLikes);   


export default router;