import Post from '../model/postModel.js';
import User from '../model/userModel.js';
import slugify from 'slugify';
import ImageKit from 'imagekit';
import dotenv from 'dotenv';
dotenv.config();



export const getPosts = async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;
   // const skip = (page - 1) * limit;

    // Fetch posts with pagination
    const posts = await Post.find()
    .populate('user', 'username')
    .skip((page - 1) * limit)
    .limit(limit);
    // Fetch total post count
    const totalPosts = await Post.countDocuments();
    //
    const hasMore = page * limit < totalPosts;
    res.status(200).json({ posts, hasMore });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts' });
  }
};

export const getPost = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug }).populate("user", "username img");
    console.log('Database result:', post);
    res.status(200).json(post);
  } catch (error) {
    console.error('Error in getPost:', error);
    res.status(500).json({ message: 'Error fetching post' });
  }
};

/*/ Create a new post
export const createPost = async (req, res) => {
  console.log('Request Auth:', req.auth());
  try {
   const clerkUserId = req.auth().userId; // Get the Clerk user ID from the request
    //console.log(req.headers);
   if (!clerkUserId) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    const user = await User.findOne({ clerkUserId });
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    const newPost = new Post({ user: user._id, ...req.body });
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Error creating post' });
  }
};*/

export const createPost = async (req, res) => {
  try {
    // 1. Authentication check
    const clerkUserId = req.auth().userId;
    if (!clerkUserId) {
      return res.status(401).json({ 
        success: false,
        message: 'Not authorized' 
      });
    }

    // 2. Find user in database
    const user = await User.findOne({ clerkUserId });
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    // 3. Validate required fields
    const { 
      title, 
      content,  // Changed from 'value' to 'content'
      coverImage, // Changed from 'cover'
      images,    // Changed from 'img' (now accepts array)
      videos,
      desc = '',
      category = 'general',
      isFeatured = false
    } = req.body;

    // Enhanced validation
    const errors = {};
    if (!title?.trim()) errors.title = 'Title is required';
    if (!content?.trim()) errors.content = 'Content is required';
    if (title?.length > 120) errors.title = 'Title must be less than 120 characters';
    
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    // 4. Generate unique slug
    let slug = slugify(title, {
      lower: true,
      strict: true,
      trim: true
    });

    // Check for existing slugs and make unique if needed
    const slugExists = await Post.exists({ slug });
    if (slugExists) {
      const randomSuffix = Math.floor(Math.random() * 10000);
      slug = `${slug}-${randomSuffix}`;
    }

    // 5. Create new post with all fields
    const newPost = new Post({
      user: user._id,
      title: title.trim(),
      slug,
      content: content.trim(),
      desc: desc.trim(),
      category,
      coverImage,
      images: Array.isArray(images) ? images : images ? [images] : [],
      videos: Array.isArray(videos) ? videos : videos ? [videos] : [],
      isFeatured
    });

    const savedPost = await newPost.save();
    
    // 6. Return success response
    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      post: {
        id: savedPost._id,
        title: savedPost.title,
        slug: savedPost.slug,
        coverImage: savedPost.coverImage,
        createdAt: savedPost.createdAt
      }
    });

  } catch (error) {
    console.error('Error creating post:', error);
    
    // Handle specific error types
    if (error.name === 'ValidationError') {
      const errors = Object.keys(error.errors).reduce((acc, key) => {
        acc[key] = error.errors[key].message;
        return acc;
      }, {});
      
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }
    
    // Handle duplicate key error (unique slug)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Slug already exists',
        error: 'Please try again with a different title'
      });
    }
    
    // Generic server error
    res.status(500).json({ 
      success: false,
      message: 'Server error creating post',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};
   

    

export const deletePost = async (req, res) => {
  try {
    const clerkUserId = req.auth().userId; // Get the Clerk user ID from the request
    if (!clerkUserId) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    const user = await User.findOne({ clerkUserId });
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    const post = await Post.findByIdAndDelete({ _id: req.params.id, user: user._id });
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Error deleting post' });
  }
};


const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

export const uploadAuth = async (req, res) => {
  try {
    const result = imagekit.getAuthenticationParameters();
    res.status(200).json(result);
  } catch (error) {
    console.error('Error in uploadAuth:', error);
    res.status(500).json({ message: 'Error generating upload authentication' });
  }
};