import Comment from '../model/commentModel.js'
import User from '../model/userModel.js'; 

export const getPostComments = async (req, res) => {
     try {
    const comments = await Comment.find({post: req.params.postId})
    .populate("user", "username image")
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

        return res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};