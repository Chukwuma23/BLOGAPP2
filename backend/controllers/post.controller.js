import Post from '../model/postModel.js';
import User from '../model/userModel.js';
import slugify from 'slugify';
import ImageKit from 'imagekit';
import dotenv from 'dotenv';
import { Admin } from 'mongodb';
dotenv.config();



export const getPosts = async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
   // let sortObj = { createdAt: -1 }; // Default sorting
   // const skip = (page - 1) * limit;

   const query = {};

   const cat = req.query.cat;
   const author = req.query.author;
   const searchQuery = req.query.search;
   const sortQuery = req.query.sort;
   const featured = req.query.featured;

    if (cat) {
      query.category = cat;
    }

      if (searchQuery) {
      query.title = { $regex: searchQuery, $options: "i" };
      }

    if (author) {
      const user = await User.findOne({username: author}).select("_id");

      if (!user) {
      return res.status(404).json("No post found");
    }
    query.user = user._id;
    }
    
 let sortObj = { createdAt: -1}; // Initialize sortObj
 if (sortQuery) {
  switch (sortQuery) {
    case "newest":
      sortObj = { createdAt: -1 };
      break;  // Added missing break
    case "oldest":
      sortObj = { createdAt: 1 };
      break;
    case "popular":
      sortObj = { visit: -1 };
      break;
    case "trending":
      sortObj = { visit: -1 };
      query.createdAt = {
        $gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
      };
      break;
    default:
      sortObj = { createdAt: -1 };  // Default sorting
      break;
  }
}

if (featured) {
  query.isFeatured = true;
}
    // Fetch posts with pagination
    const posts = await Post.find(query)
    .populate('user', 'username')
    .sort(sortObj)
    .skip((page - 1) * limit)
    .limit(limit);
    // Fetch total post count
    const totalPosts = await Post.countDocuments();

    //Count with the same filters
    const hasMore = page * limit < totalPosts;
    res.status(200).json({ posts, hasMore });
  } catch (error) {
     console.error('Error in getPosts:', error); 
    res.status(500).json({ message: 'Error fetching posts' });
  }
};

export const getPost = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug }).populate("user", "username image");
    console.log('Database result:', post);
    res.status(200).json(post);
  } catch (error) {
    console.error('Error in getPost:', error);
    res.status(500).json({ message: 'Error fetching post' });
  }
};


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
      content,  
      coverImage, 
      images,    
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
    const role = req.auth().sessionClaims?.metadata?.role || "user";
    if(role === "admin") {
    await Post.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: 'Post deleted successfully' });
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



export const featurePost = async (req, res) => {
  try {
    const clerkUserId = req.auth().userId;
    if (!clerkUserId) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    const role = req.auth().sessionClaims?.metadata?.role || "user";
    if (role !== "admin") {
      return res.status(403).json({ message: 'Only admins can feature posts' });
    }

    const postId = req.body.postId; // Make sure this matches what your frontend sends
    if (!postId) {
      return res.status(400).json({ message: 'Post ID is required' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { isFeatured: !post.isFeatured },
      { new: true }
    );

    return res.status(200).json({ 
      message: `Post ${updatedPost.isFeatured ? 'featured' : 'unfeatured'} successfully`,
      post: updatedPost 
    });
    
  } catch (error) {
    console.error('Error featuring post:', error);
    res.status(500).json({ message: 'Error featuring post' });
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


export const updatePost = async (req, res) => {
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

    // 3. Check if post exists and user has permission
    const postId = req.params.id;
    const post = await Post.findById(postId);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if user owns the post or is admin
    const role = req.auth().sessionClaims?.metadata?.role || "user";
    if (post.user.toString() !== user._id.toString() && role !== "admin") {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to edit this post'
      });
    }

    // 4. Validate and extract fields
    const {
      title,
      content,
      coverImage,
      images,
      videos,
      desc,
      category,
      isFeatured
    } = req.body;

    // Enhanced validation
    const errors = {};
    if (title && !title.trim()) errors.title = 'Title cannot be empty';
    if (content && !content.trim()) errors.content = 'Content cannot be empty';
    if (title && title.length > 120) errors.title = 'Title must be less than 120 characters';
    
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    // 5. Generate new slug if title changed
    let slug = post.slug;
    if (title && title !== post.title) {
      slug = slugify(title, {
        lower: true,
        strict: true,
        trim: true
      });

      // Check for existing slugs and make unique if needed
      const slugExists = await Post.findOne({ slug, _id: { $ne: postId } });
      if (slugExists) {
        const randomSuffix = Math.floor(Math.random() * 10000);
        slug = `${slug}-${randomSuffix}`;
      }
    }

    // 6. Update post
    const updatedData = {
      ...(title && { title: title.trim() }),
      ...(slug && { slug }),
      ...(content && { content: content.trim() }),
      ...(desc !== undefined && { desc: desc.trim() }),
      ...(category && { category }),
      ...(coverImage !== undefined && { coverImage }),
      ...(images !== undefined && { images: Array.isArray(images) ? images : images ? [images] : [] }),
      ...(videos !== undefined && { videos: Array.isArray(videos) ? videos : videos ? [videos] : [] }),
      ...(isFeatured !== undefined && role === "admin" && { isFeatured })
    };

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      updatedData,
      { new: true, runValidators: true }
    ).populate('user', 'username');

    // 7. Return success response
    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      post: updatedPost
    });

  } catch (error) {
    console.error('Error updating post:', error);
    
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
      message: 'Server error updating post',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};



export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("user", "username image");
    console.log('Database result by ID:', post);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json(post);
  } catch (error) {
    console.error('Error in getPostById:', error);
    res.status(500).json({ message: 'Error fetching post' });
  }
};


// Like post like
export const likePost = async (req, res) => {
  try {
    const clerkUserId = req.auth().userId;
    if (!clerkUserId) {
      return res.status(401).json({ message: 'Not authenticated!' });
    }

    const user = await User.findOne({ clerkUserId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user already liked using proper ObjectId comparison
    const alreadyLiked = post.likes.some(likeId => 
      likeId.toString() === user._id.toString()
    );
    
    if (alreadyLiked) {
      // Unlike
      post.likes.pull(user._id);
      post.likeCount = Math.max(0, post.likeCount - 1);
    } else {
      // Like
      post.likes.push(user._id);
      post.likeCount += 1;
    }

    await post.save();
    
    res.json({ 
      likeCount: post.likeCount,
      isLiked: !alreadyLiked 
    });
  } catch (error) {
    console.error('Error in likePost:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get post likes
export const getPostLikes = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('likes', 'username image')
      .select('likes likeCount');
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};