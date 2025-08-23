// controllers/replyController.js
import Reply from '../model/replyModel.js';
import User from '../model/userModel.js'; 
import Comment from '../model/commentModel.js';

// Get all replies for a comment
export const getReplies = async (req, res) => {
  try {
    const replies = await Reply.find({ comment: req.params.commentId })
      .populate("user", "username image")
      .sort({ createdAt: 1 }); // Oldest first for replies
    
    res.json(replies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Add a reply to a comment
export const addReply = async (req, res) => {
  try {
    const clerkUserId = req.auth().userId;
    const commentId = req.params.commentId;
    const { desc } = req.body;
    
    if (!clerkUserId) {
      return res.status(401).json("Not authenticated!");
    }
    
    // Verify the parent comment exists
    const parentComment = await Comment.findById(commentId);
    if (!parentComment) {
      return res.status(404).json("Comment not found!");
    }
    
    const user = await User.findOne({ clerkUserId });
    if (!user) {
      return res.status(404).json("User not found!");
    }
    
    const newReply = new Reply({
      desc,
      user: user._id,
      comment: commentId,
    });
    
    const savedReply = await newReply.save();
    await savedReply.populate('user', 'username image');
    
    res.status(201).json(savedReply);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a reply
export const deleteReply = async (req, res) => {
  try {
    const clerkUserId = req.auth().userId;
    if (!clerkUserId) {
      return res.status(401).json({ message: 'Not authenticated!' });
    }

    const role = req.auth().sessionClaims?.metadata?.role || "user";
    const replyId = req.params.id;

    // Admin can delete any reply
    if (role === "admin") {
      await Reply.findByIdAndDelete(replyId);
      return res.status(200).json({ message: 'Reply deleted successfully' });
    }

    // Regular users can only delete their own replies
    const user = await User.findOne({ clerkUserId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const deletedReply = await Reply.findOneAndDelete({
      _id: replyId,
      user: user._id
    });

    if (!deletedReply) {
      return res.status(403).json({ message: 'Not authorized to delete this reply' });
    }

    return res.status(200).json({ message: 'Reply deleted successfully' });
  } catch (error) {
    console.error('Error deleting reply:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};


