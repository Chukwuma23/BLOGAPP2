import Comment from '../model/commentModel.js'
import User from '../model/userModel.js'; 
import Post from '../model/postModel.js'; 

export const getPostComments = async (req, res) => {
     try {
    const comments = await Comment.find({post: req.params.postId})
    .populate("user", "username image")
     .populate("likes", "username image") 
    .sort({createdAt: - 1});
    res.json(comments);
     } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const addComment = async (req, res) => {
    const clerkUserId = req.auth().userId;
    const postId = req.params.postId;
if(!clerkUserId){
    return res.status(401).json("Not authenticated!");
}
const user = await User.findOne({clerkUserId});
const newComment = new Comment({
    ...req.body,
    user: user._id,
    post: postId,
});
const saveComment = await newComment.save()
 // Update post comment count
    await Post.findByIdAndUpdate(postId, {
        $inc: { commentCount: 1 }
    });

setTimeout(() => {
res.status(201).json(saveComment)
}, 3000);
};

export const deleteComment = async (req, res) => {
    try {
        const clerkUserId = req.auth().userId;
        if (!clerkUserId) {
            return res.status(401).json({ message: 'Not authenticated!' });
        }

        const role = req.auth().sessionClaims?.metadata?.role || "user";
        const commentId = req.params.id;

        if (role === "admin") {
            await Comment.findByIdAndDelete(commentId);
            return res.status(200).json({ message: 'Comment deleted successfully' });
        }

        const user = await User.findOne({ clerkUserId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const deletedComment = await Comment.findOneAndDelete({
            _id: commentId,
            user: user._id
        });

        if (!deletedComment) {
            return res.status(403).json({ message: 'Not authorized to delete this comment' });
        }
          if (deletedComment) {
            // Update post comment count
            await Post.findByIdAndUpdate(deletedComment.post, {
                $inc: { commentCount: -1 }
            });
        }


        return res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};


// Like a comment
export const likeComment = async (req, res) => {
  try {
    const clerkUserId = req.auth().userId;
    if (!clerkUserId) {
      return res.status(401).json({ message: 'Not authenticated!' });
    }

    const user = await User.findOne({ clerkUserId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user already liked
    const alreadyLiked = comment.likes.includes(user._id);
    
    if (alreadyLiked) {
      // Unlike
      comment.likes.pull(user._id);
      comment.likeCount = Math.max(0, comment.likeCount - 1);
    } else {
      // Like
      comment.likes.push(user._id);
      comment.likeCount += 1;
    }

    await comment.save();
    res.json({ 
      likeCount: comment.likeCount,
      isLiked: !alreadyLiked 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get comment likes
export const getCommentLikes = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id)
      .populate('likes', 'username image')
      .select('likes likeCount');
    
    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get comment count for a post
export const getCommentCount = async (req, res) => {
  try {
    const postId = req.params.id;
    
    // Option A: Get from Post model (if you store commentCount there)
    const post = await Post.findById(postId).select('commentCount');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    
    res.json({ commentCount: post.commentCount || 0 });
    
    // Option B: Count comments directly (if you don't store commentCount)
    // const commentCount = await Comment.countDocuments({ post: postId });
    // res.json({ commentCount });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



