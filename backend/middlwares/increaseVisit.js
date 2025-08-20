import Post from "../model/postModel.js";

const increaseVisit = async (req, res, next) => {
    try {
        const slug = req.params.slug; // ✅ Correct parameter name
        
        // Use findOneAndUpdate with slug instead of findByIdAndUpdate
        await Post.findOneAndUpdate(
            { slug: slug }, // Find by slug
            { $inc: { visit: 1 } } // Increment visit count
        );
        next();
    } catch (error) {
        console.error('Error in increaseVisit:', error);
        next(error); // Pass error to error handler
    }
};

export default increaseVisit;