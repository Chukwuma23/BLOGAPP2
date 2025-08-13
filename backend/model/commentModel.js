import mongoose from 'mongoose';
const { Schema } = mongoose; // Properly destructure Schema

const commentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  post: {
    type: Schema.Types.ObjectId, // Changed from Schema to mongoose.Schema
    ref: 'Post',
    required: true,
  },
}, { 
  timestamps: true 
});

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;