import Post from '../model/postModel.js';
import User from '../model/userModel.js';
import slugify from 'slugify';
import ImageKit from 'imagekit';
import dotenv from 'dotenv';
dotenv.config();



export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts' });
  }
};

export const getPost = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
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
      return res.status(401).json({ message: 'Not authorized' });
    }

    // 2. Find user in database
    const user = await User.findOne({ clerkUserId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 3. Validate required fields
    const { title, content } = req.body;
    
    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: {
          ...(!title?.trim() && { title: 'Title is required' }),
          ...(!content?.trim() && { content: 'Content is required' })
        }
      });
    }

    // 4. Generate unique slug
    let slug = slugify(title, {
      lower: true,
      strict: true,
      trim: true
    });

    // Check for existing slugs and make unique if needed
    const existingPost = await Post.findOne({ slug });
    if (existingPost) {
      const randomSuffix = Math.floor(Math.random() * 10000);
      slug = `${slug}-${randomSuffix}`;
    }

    // 5. Create new post with all fields
    const newPost = new Post({
      user: user._id,
      title: title.trim(),
      slug,
      content: content.trim(),
      desc: req.body.desc?.trim() || '', // Optional field
      category: req.body.category || 'general',
      image: req.body.image || null,
      isFeatured: req.body.isFeatured || false
    });

    const savedPost = await newPost.save();
    
    // 6. Return success response
    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      post: savedPost
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
      error: error.message 
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