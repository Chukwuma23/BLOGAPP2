// routes/replyRoute.js
import express from 'express';
import { 
  getReplies, 
  addReply, 
  deleteReply 
} from '../controllers/replyController.js';

const router = express.Router();

router.get('/:commentId', getReplies);
router.post('/:commentId', addReply);
router.delete('/:id', deleteReply);

export default router;