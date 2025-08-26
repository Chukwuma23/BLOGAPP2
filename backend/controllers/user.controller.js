import User from "../model/userModel.js";

export const getUserSavedPosts = async (req, res) => {
    try {
        const clerkUserId = req.auth().userId; // Fixed typo from clerUserkId

        if (!clerkUserId) {
            return res.status(401).json({ message: 'Not authenticated!' });
        }

        const user = await User.findOne({ clerkUserId }); // Fixed field name
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json(user.savePosts || []); // Return empty array if null
    } catch (error) {
        console.error("Error fetching saved posts:", error);
        return res.status(500).json({ message: 'Server error' });
    }
};

export const savePost = async (req, res) => {
    try {
        const clerkUserId = req.auth().userId;
        const postId = req.body.postId;

        if (!clerkUserId) {
            return res.status(401).json({ message: 'Not authenticated!' });
        }
     /*   const role = req.auth().sessionClaims?.metadata?.role || "user";
    if(role === "admin") {
    await Post.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: 'Comment deleted successfully' });
    }*/

        if (!postId) {
            return res.status(400).json({ message: 'Post ID is required' });
        }

        const user = await User.findOne({ clerkUserId }); // Fixed field name
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if post is already saved
        const isSaved = user.savePosts?.includes(postId); // Using savePosts to match model

        const updateOperation = isSaved 
            ? { $pull: { savePosts: postId } } 
            : { $push: { savePosts: postId } };

        await User.findOneAndUpdate(
            { clerkUserId },
            updateOperation,
            { new: true }
        );

        return res.status(200).json({ 
            message: isSaved ? "Post unsaved" : "Post saved",
            isSaved: !isSaved 
        });
    } catch (error) {
        console.error("Error saving post:", error);
        return res.status(500).json({ message: 'Server error' });
    }
};



export const createTestUser = async (req, res) => {
  try {
    const testUser = new User({
      clerkUserId: 'test_' + Date.now(),
      username: 'testuser_' + Date.now(),
      email: 'test' + Date.now() + '@example.com',
      image: '',
    });
    
    const savedUser = await testUser.save();
    console.log('✅ Test user created successfully:', savedUser._id);
    return res.status(201).json({
      message: 'Test user created',
      user: savedUser
    });
  } catch (error) {
    console.error('❌ Error creating test user:', error);
    return res.status(500).json({ 
      message: 'Test failed', 
      error: error.message 
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    console.log('📋 Total users in DB:', users.length);
    return res.status(200).json({
      count: users.length,
      users: users
    });
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    return res.status(500).json({ 
      message: 'Error fetching users', 
      error: error.message 
    });
  }
};