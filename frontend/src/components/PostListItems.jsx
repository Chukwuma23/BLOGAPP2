// Import Image component from ImageKit for optimized image handling
import { Image } from "@imagekit/react";
// Import Link component for client-side navigation
import { Link} from "react-router-dom";
import { format } from "timeago.js";

/**
 * PostListItems Component
 * 
 * Displays an individual blog post in a card format with:
 * - Featured image
 * - Title
 * - Category
 * - Publication date
 * - Content preview
 * - Read more link
 * 
 * @param {Object} props - Component props
 * @param {Object} props.post - The post data object
 */
const PostListItems = ({ post }) => {
    // Early return if no post data is provided
    if (!post) return null;
    
    /*
     * Formats a date string into a readable format (e.g., "Jun 15, 2023")
     * @param {string} dateString - ISO date string from the database
     * @returns {string} Formatted date
    
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',  // Show full year (2023)
            month: 'short',  // Abbreviated month (Jun)
            day: 'numeric'   // Day of month (15)
        });
    }; */

    return (
        // Main container with responsive flex layout
        <div className="flex flex-col xl:flex-row gap-8 md:gap-12 items-center justify-center mb-8">
            {/* Post Image Section - Only visible on xl screens and hidden on medium */}
            {post.coverImage && (
                <div className="md:hidden w-full xl:block relative items-center justify-center right-10 left-10 relative">
                    <Image
                        urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}
                        src={post.coverImage}
                        className="rounded-2xl object-cover w-5/6 md:w-4/6 max-w-md"
                        alt={post.title}
                        transformation={[{
                            height: 300,   // Set image height
                            width: 400,    // Set image width
                            quality: 80    // Set image quality (80%)
                        }]}
                    />
                </div>
            )}

            {/* Post Details Section */}
            <div className="flex-col flex gap-4 mb-4">
                {/* Post Title - Links to full post */}
                <Link 
                    to={`/${post.slug}`} 
                    className="text-2xl font-semibold hover:text-blue-600 right-40 left-20 relative"
                >
                    {post.title}
                </Link>
                
                {/* Post Metadata Row */}
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                     <span>written by:</span>
                     <Link className="text-blue-800 hover:underline"  to={`/posts?author=${post.user?.username}`}>
                        {post.user?.username || "Unknown author"}
                    </Link>
                    {/* Category link - TODO: Link to category page */}
                     <span>Cat:</span>
                    <Link className="text-blue-800 hover:underline">
                        {post.category || 'Uncategorized'}
                    </Link>
                    <span>Posted: </span>
                    {/* Formatted publication date */}
                    <span className="text-blue-800">
                        {format(post.createdAt)}
                    </span>
                </div>
                
                {/* Post Content Preview */}
                <p className="text-gray-600 line-clamp-3">
                    {post.desc || // Use description if available
                     post.content.replace(/<[^>]*>/g, '').substring(0, 200)}...
                     {/* Fallback to content (remove HTML tags and truncate) */}
                </p>
                
                {/* Read More Link */}
                <Link 
                    to={`/${post.slug}`} 
                    className="underline text-blue-800 text-sm hover:text-blue-600"
                >
                    Read more →
                </Link>
            </div>
        </div>
    );
};

export default PostListItems;