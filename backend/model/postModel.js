
import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  coverImage: {  // matches frontend's 'cover'
    type: String,
  },
  images: {      // change from 'image' to 'images' array
    type: [String],
    default: []
  },
  videos: {
    type: [String],
    default: []
  },
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  desc: {
    type: String,
  },
  category: {
    type: String,
    default: 'general',
  },
  content: {     // frontend sends 'value' which should map to this
    type: String,
    required: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  visit: {
    type: Number,
    default: 0,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  likeCount: {
    type: Number,
    default: 0
  },
  commentCount: {
    type: Number,
    default: 0
  },
}, { timestamps: true });

export default mongoose.model('Post', postSchema);
