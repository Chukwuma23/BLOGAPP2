import Comment from '../model/commentModel.js'
import User from '../model/userModel.js'; 

export const getPostComments = async (req, res) => {
     try {
    const comments = await Comment.find({post: req.params.postId})
    .populate("user", "username img")
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
res.status(201).json(saveComment);;
};


export const deleteComment = async (req, res) => {
    const clerkUserId = req.auth.userId;
    const postId = res.params.id;
if(!clerkUserId){
    return res.status(401).json("Not authenticated!");
};
const user = await user.findOne({clerkUserId});
const deleteComment = await Comment.findOneAndDelete({
    _id: id,
    user: user._Id,
});

if(!deleteComment){
return res.status(401).json("You are not allowed to delete this comment")
};
res.status(200).json("Comment deletded");
};