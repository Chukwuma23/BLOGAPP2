import { Image } from "@imagekit/react";
import axios from "axios";
import { Link } from "react-router-dom";
import { format } from "timeago.js";
import { useState, useEffect } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

// API call function
const likePostApi = async (postId, token) => {


  const res = await axios.patch(
    `${import.meta.env.VITE_API_URL}/posts/${postId}/like`,
    {},
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

// Add this function to fetch comment count
const fetchCommentCount = async (postId) => {
  console.log('Fetching comment count for post:', postId);
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/comments/${postId}/comment-count`
    );
    console.log('Comment count response:', res.data);
    return res.data.commentCount;
  } catch (error) {
    console.error('Error fetching comment count:', error.response?.data || error.message);
    return 0;
  }
};


const PostListItems = ({ post }) => {

    const formatViews = (count) => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count;
  };

  if (!post) return null;

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const { user: currentUser } = useUser();
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
   const [commentCount, setCommentCount] = useState(post.commentCount || 0);

   // Fetch comment count when component mounts
  useEffect(() => {
    const getCommentCount = async () => {
      try {
        const count = await fetchCommentCount(post._id);
        setCommentCount(count);
      } catch (error) {
        console.error('Error fetching comment count:', error);
        // Fallback to post.commentCount if available
        setCommentCount(post.commentCount || 0);
      }
    };
     getCommentCount();
  }, [post._id, post.commentCount]);


  // Check if current user liked this post
  useEffect(() => {
    if (post.likes && currentUser) {
      const userLiked = post.likes.some(like => {
        const likeId = like._id ? like._id.toString() : like.toString();
        return likeId === currentUser.id;
      });
      setIsLiked(userLiked);
    }
    setLikeCount(post.likeCount || 0);
  }, [post, currentUser]);

  const likeMutation = useMutation({
  mutationFn: async () => {
    const token = await getToken();
    return likePostApi(post._id, token);
  },
  onSuccess: (data) => {
    // Update cache (your existing code)
  },
  onError: (error, variables, context) => {
    toast.error(error.response?.data?.message || 'Error liking post');
    
    // SIMPLE REVERT - toggle back
    setIsLiked(prev => !prev);
    setLikeCount(prev => isLiked ? prev + 1 : prev - 1);
    
    // OR BETTER: Use closure to capture original values
    // setIsLiked(context.originalIsLiked);
    // setLikeCount(context.originalLikeCount);
  },
});

const handleLike = () => {
  if (!currentUser) {
    toast.error("Please login to like post");
    return;
  }

  // Optimistic update
  const newIsLiked = !isLiked;
  const newLikeCount = newIsLiked ? likeCount + 1 : likeCount - 1;
  
  setIsLiked(newIsLiked);
  setLikeCount(newLikeCount);

  // API call with context for potential revert
  likeMutation.mutate({
    originalIsLiked: isLiked,
    originalLikeCount: likeCount
  });
};
  
 

  return (
   <div className="flex flex-col gap-6 mb-8 relative mt-10 w-full md:flex-row py-5 shadow-xl rounded-lg bg-white">
  {post.coverImage && (
    <div className="w-full">
      <Image
        urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}
        src={post.coverImage}
        className="rounded-2xl object-cover w-full max-w-md mx-auto hover:scale-90 transition-transform duration-300"
        alt={post.title}
        transformation={[{
          height: 300,
          width: 400,
          quality: 80
        }]}
      />
    </div>
  )}

  <div className="flex flex-col gap-4 items-center w-full px-4">
    <Link 
      to={`/${post.slug}`} 
      className="text-lg md:text-xl font-semibold hover:text-blue-600 text-gray-900 text-center"
    >
      <h1>{post.title}</h1>
    </Link>
    
    <div className="flex flex-wrap items-center gap-2 text-gray-500 text-sm md:text-md justify-center">
      <span>written by:</span>
      <Link className="text-blue-600 hover:underline font-medium" to={`/posts?author=${post.user?.username}`}>
        {post.user?.username || "Unknown author"}
      </Link>
      <span>•</span>
      <span className="text-blue-600 font-medium">
        {post.category || 'Uncategorized'}
      </span>
      <span>•</span>
      <span className="text-gray-500">
        {format(post.createdAt)}
      </span>
    </div>
    
    <p className="text-gray-600 line-clamp-3 text-sm md:text-sm break-words text-center">
      {post.desc || post.content?.replace(/<[^>]*>/g, '').substring(0, 200)}...
    </p>
    
    <Link 
      to={`/${post.slug}`} 
      className="underline text-blue-600 text-md hover:text-blue-700 font-medium"
    >
      Read more →
    </Link>
    
    {/* Facebook-style stats and actions bar */}
    <div className="w-full border-t border-gray-200 pt-3 mt-3">
      {/* Stats row */}
      <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
        <div className="flex items-center gap-1">
          <div className="bg-blue-600 rounded-full p-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="white">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>
          <span>{likeCount}</span>
        </div>
        
        <div className="flex items-center gap-3">
            
          <div className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span>{post.commentCount || 0}</span>
          </div>
       
          <span>•</span>
          <div className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            <span>{post.visit || 0}</span>
          </div>
        </div>
      </div>

      {/* Action buttons row - Facebook style */}
      <div className="flex justify-around border-t border-gray-100 pt-2">
        {/* Like button */}
        <button 
          onClick={handleLike}
          disabled={likeMutation.isPending}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            isLiked 
              ? 'text-blue-600 bg-blue-50 hover:bg-blue-100' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill={isLiked ? 'currentColor' : "none"} 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          Like
        </button>
          <Link to={`/${post.slug}`}>
        {/* Comment button */}
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
           {commentCount}
        </button>
           </Link>

        {/* Share button */}
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
            <polyline points="16 6 12 2 8 6"/>
            <line x1="12" y1="2" x2="12" y2="15"/>
          </svg>
          Share
        </button>
      </div>
    </div>
  </div>
</div>
  );
};

export default PostListItems;