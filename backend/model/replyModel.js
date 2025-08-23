// models/replyModel.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

const replySchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  comment: {  // Reference to the parent comment
    type: Schema.Types.ObjectId,
    ref: 'Comment',
    required: true,
  },
}, { 
  timestamps: true 
});

const Reply = mongoose.model('Reply', replySchema);
export default Reply;