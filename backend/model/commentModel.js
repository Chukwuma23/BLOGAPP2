import mongoose from 'mongoose';
const commentSchema = new Schema({
  user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
   desc: {
    type: String,
    required: true,
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
}, { timestamps: true },
);

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
