import { useAuth, useUser} from "@clerk/clerk-react";
import { Image } from "@imagekit/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { format } from "timeago.js";
import { useState, useEffect, useRef } from "react";

// Fetch replies for a comment
const fetchReplies = async (commentId) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/replies/${commentId}`);
  return res.data;
};

// Like comment function
const likeComment = async (commentId, token) => {
  const res = await axios.patch(
    `${import.meta.env.VITE_API_URL}/comments/${commentId}/like`,
    {},
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

const Comment = ({ comment, postId }) => {
  const { user: currentUser } = useUser();
  const { getToken } = useAuth();
  const role = currentUser?.publicMetadata?.role;
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyCount, setReplyCount] = useState(0);
   const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likeCount || 0);
  const [showOptionBar, setShowOptionBar] = useState(false);

  const queryClient = useQueryClient();

 const optionBarRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionBarRef.current && !optionBarRef.current.contains(event.target)) {
        setShowOptionBar(false);
      }
    };

    if (showOptionBar) {
      document.addEventListener('mousedown', handleClickOutside);
    }

return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showOptionBar]);

  const toggleOptionBar = () => {
    setShowOptionBar(!showOptionBar);
  };
    // Check if current user liked this comment - FIXED
  useEffect(() => {
    if (comment.likes && currentUser) {
      // Find the user in the likes array
      const userLiked = comment.likes.some(like => {
        // Handle both populated likes (object with _id) and object IDs (strings)
        const likeId = like._id ? like._id.toString() : like.toString();
        return likeId === currentUser.id;
      });
      setIsLiked(userLiked);
    }
    setLikeCount(comment.likeCount || 0);
  }, [comment, currentUser]);

 


  // Query for replies
  const { data: replies, isLoading: repliesLoading, refetch: refetchReplies } = useQuery({
    queryKey: ["replies", comment._id],
    queryFn: () => fetchReplies(comment._id),
    enabled: showReplies,
    onSuccess: (repliesData) => {
      // Use the length of replies array as count (temporary solution)
      setReplyCount(repliesData.length);
    }
  });


// Mutation for liking comment - FIXED
  const likeMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return likeComment(comment._id, token);
    },
    onSuccess: (data) => {
      // Update the specific comment in the cache instead of invalidating
      queryClient.setQueryData(["comments", postId], (oldData) => {
        return oldData.map((c) => {
          if (c._id === comment._id) {
            return {
              ...c,
              likeCount: data.likeCount,
              likes: data.isLiked 
                ? [...(c.likes || []), { _id: currentUser.id }]
                : (c.likes || []).filter(like => {
                    const likeId = like._id ? like._id.toString() : like.toString();
                    return likeId !== currentUser.id;
                  })
                          };
          }
          return c;
        });
      });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error liking comment');
      // Revert on error
      setIsLiked(prev => !prev);
      setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    },
  });

  // Fetch replies count when component mounts or when replies change
  useEffect(() => {
    if (showReplies) {
      refetchReplies();
    } else {
      // If we're not showing replies, we can still get a basic count
      // by making a quick API call or using a separate count endpoint if available
      axios.get(`${import.meta.env.VITE_API_URL}/replies/${comment._id}`)
        .then(response => {
          setReplyCount(response.data.length);
        })
        .catch(error => {
          console.error("Error fetching reply count:", error);
          // If the endpoint doesn't exist yet, we'll handle it gracefully
          setReplyCount(0);
        });
    }
  }, [comment._id, showReplies]);

  // Mutation for deleting comment
  const deleteCommentMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return axios.delete(
        `${import.meta.env.VITE_API_URL}/comments/${comment._id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      toast.success("Comment deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error deleting comment');
    },
  });

  // Mutation for adding reply
  const replyMutation = useMutation({
    mutationFn: async (newReply) => {
      const token = await getToken();
      return axios.post(
        `${import.meta.env.VITE_API_URL}/replies/${comment._id}`,
        newReply,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["replies", comment._id] });
      // Update reply count by incrementing
      setReplyCount(prevCount => prevCount + 1);
      setShowReplyForm(false);
      toast.success("Reply added successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error adding reply');
    },
  });

  // Mutation for deleting reply
  const deleteReplyMutation = useMutation({
    mutationFn: async (replyId) => {
      const token = await getToken();
      return axios.delete(
        `${import.meta.env.VITE_API_URL}/replies/${replyId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["replies", comment._id] });
      // Update reply count by decrementing
      setReplyCount(prevCount => Math.max(0, prevCount - 1));
      toast.success("Reply deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error deleting reply');
    },
  });

  const handleReplySubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const desc = formData.get("desc");
    replyMutation.mutate({ desc });
    e.target.reset();
  };

  const handleDeleteReply = (replyId) => {
    if (window.confirm(`Are you sure you want to delete this reply?`)) {
      deleteReplyMutation.mutate(replyId);
    }
  };

  if (!comment) return null;


   const handleLike = () => {
    if (!currentUser) {
      toast.error("Please login to like comments");
      return;
    }
     // Optimistic update - update UI immediately
    const newIsLiked = !isLiked;
    const newLikeCount = newIsLiked ? likeCount + 1 : Math.max(0, likeCount - 1);
     setIsLiked(newIsLiked);
    setLikeCount(newLikeCount);

    // Then make the API call
    likeMutation.mutate();
  };

    
  return (
    <div className="p-4 mb-4 bg-blue-800 rounded-xl">
      <div className="flex flex- items-center gap-2 justify-between">
        <div className="flex items-center gap-4">
        {comment.user?.image && (
          <Image
            urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}
            src={comment.user?.image}
            className="w-10 h-10 rounded-full object-cover"
            alt="User avatar"
          />
        )}
        <span className="font-medium text-white">
          {comment.user?.username}
        </span>
        <span className="text-sm text-gray-300">
          {format(comment.createdAt)}
        </span>
        </div>
           <svg 
           xmlns="http://www.w3.org/2000/svg" 
           width="24" 
           height="24"
            viewBox="0 0 24 24"
             fill="none"
              stroke="currentColor"
               strokeWidth="2"
               className="text-white relative left-50 left-30"
               onClick={ toggleOptionBar}
               >
            <circle cx="12" cy="5" r="1"/>
            <circle cx="12" cy="12" r="1"/>
            <circle cx="12" cy="19" r="1"/>
          </svg>

        {showOptionBar && (
        <div   ref={optionBarRef} className= "bg-blue-600 w-2/6 flex flex-col justify-left py-2 gap-4 rounded relative text-white"
      >
            {currentUser && (comment.user?.username === currentUser.username || role === "admin") && 
          <button 
            className="text-xs text-red-300 hover:text-red-500 cursor-pointer "
            onClick={() => {
              if (window.confirm("Are you sure you want to delete this comment?")) {
                deleteCommentMutation.mutate();
              }
            }}

            disabled={deleteCommentMutation.isPending}
          >
            {deleteCommentMutation.isPending ? "Deleting..." : "Delete"}
          </button>
        }
         {/* Reply button*/}
         {currentUser && (
          <button 
            className="text-xs  hover:text-gray-300"
            onClick={() => setShowReplyForm(!showReplyForm)}
          >
            {showReplyForm ? 'Cancel Reply' : 'Reply'}
          </button>
        )}
        <button className="text-xs hover:text-gray-300">Report comment</button>
          </div>
          
          )}

      
      </div>
      <div className="mt-4 text-white">
        <p>{comment.desc}</p>
      </div>
     

      
      
    
      {/* Display replies */}
      {showReplies && (
        <div className="mt-4 ml-6">
          {repliesLoading ? (
            <div className="text-gray-300">Loading replies...</div>
          ) : replies && replies.length > 0 ? (
            replies.map(reply => (
              <div key={reply._id} className="p-3 mb-2 bg-blue-700 rounded-lg relative">
                {/* Delete button for reply */}
                {currentUser && (reply.user?.username === currentUser.username || role === "admin") && (
                  <button
                    onClick={() => handleDeleteReply(reply._id)}
                    disabled={deleteReplyMutation.isPending}
                    className="absolute top-2 right-2 text-xs text-red-300 hover:text-red-500"
                  >
                    {deleteReplyMutation.isPending ? "..." : "×"}
                  </button>
                )}
                
                <div className="flex items-center gap-3">
                  {reply.user?.image && (
                    <Image
                      urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}
                      src={reply.user.image}
                      className="w-8 h-8 rounded-full object-cover"
                      alt="User avatar"
                    />
                  )}
                  <span className="font-medium text-white text-sm">
                    {reply.user?.username}
                  </span>
                  <span className="text-xs text-gray-300">
                    {format(reply.createdAt)}
                  </span>
                </div>
                <div className="mt-2 text-white text-sm">
                  <p>{reply.desc}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-300 text-sm">No replies yet</div>
          )}
        </div>
      )}



        {/* Reply form */}
      {showReplyForm && (
        <form onSubmit={handleReplySubmit} className="mt-4 flex items-center gap-4">
          <textarea
            name="desc"
            placeholder="Write a reply..." 
            className="flex-1 p-2 rounded"
            required
            rows="3"
          />
          <div className="flex flex-col gap-4">
          <button 
            type="submit"
            className="bg-white text-blue-800 px-3 py-1 rounded font-medium"
            disabled={replyMutation.isPending}
          >
            {replyMutation.isPending ? 'Posting...' : 'Reply'}
          </button>
          <button 
            className="text-xs bg-white p-1 rounded hover:text-blue-700"
            onClick={() => setShowReplyForm(!showReplyForm)}
          >
            Cancel
          </button>
          </div>
        </form>
      )}
      
     
     <div className="flex flex-rol justify-between">
          {/* Like Button */}
      <div className="flex items-center gap-4 mt-5">
        <button 
          onClick={handleLike}
          disabled={likeMutation.isPending}
          className={`flex items-center gap-1 text-xs ${
            isLiked ? 'text-red-500' : 'text-gray-300 hover:text-white'
          }`}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill={isLiked ?  'text-red-500' : "none"} 
            stroke="currentColor" 
            strokeWidth="3"
          >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <span>{likeCount}</span>
        </button>
      </div>

      
      {/*Show Reply*/}
      <div className="flex items-center gap-4 mt-2 flex mt-5">
       
        {/* Reply count - always show if there are replies */}
              <button 
        className="text-xs text-gray-300 hover:text-white flex items-center gap-1 transition-colors"
        onClick={() => setShowReplies(!showReplies)}
        >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="14" 
          height="14" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          className={`transition-transform duration-200 ${showReplies ? 'rotate-180' : ''}`}
        >
          <path d="M6 9l6 6 6-6"/>
        </svg>

        <span>
          {showReplies}  
          <button className="text-white text-xs float-right flex">
      <svg xmlns="http://www.w3.org/2000/svg"
       width="16" 
       height="16" 
       viewBox="0 0 24 24" 
       fill="none" 
       stroke="currentColor"
        strokeWidth="2">
       <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
      <span>({replyCount})</span>
      </button>
        </span>
        </button>
        </div>
        </div>
    </div>
  );
};

export default Comment;