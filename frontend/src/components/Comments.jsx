// Comments.jsx - Updated for separate replies
import axios from "axios";
import Comment from "../components/Comment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth, useUser } from "@clerk/clerk-react"; 
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const fetchComments = async (postId) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/comments/${postId}`);
  return res.data;
};

const Comments = ({postId, post}) => {
  const {user} = useUser();  
  const {getToken} = useAuth();
   const navigate = useNavigate();
  
  const {isPending, error, data} = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments(postId),
  })

  const queryClient = useQueryClient();

/*  const commentMutation = useMutation({
    mutationFn: async (newComment) => {
      const token = await getToken();
      return axios.post(
        `${import.meta.env.VITE_API_URL}/comments/${postId}`,
        newComment,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['comments', postId]});
    },
    onError: (error) => {
      const serverMessage = error.response?.data?.message || 'Error creating comment';
      toast.error(serverMessage);
    }
  });*/


  const commentMutation = useMutation({
  mutationFn: async (newComment) => {
    const token = await getToken();
    return axios.post(
      `${import.meta.env.VITE_API_URL}/comments/${postId}`,
      newComment,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      }
    );
  },
  onSuccess: (response) => {
    const { commentCount } = response.data;
    
    // Invalidate comments query to refetch
    queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    
    // Update the post's comment count in the cache
    queryClient.setQueryData(['posts'], (oldPosts) => {
      if (!oldPosts) return oldPosts;
      return oldPosts.map((post) => {
        if (post._id === postId) {
          return { 
            ...post, 
            commentCount: commentCount 
          };
        }
        return post;
      });
    });
    
    // Also update individual post query if it exists
    queryClient.setQueryData(['post', postId], (oldPost) => {
      if (!oldPost) return oldPost;
      return { 
        ...oldPost, 
        commentCount: commentCount 
      };
    });
  },
  onError: (error) => {
    const serverMessage = error.response?.data?.message || 'Error creating comment';
    toast.error(serverMessage);
  }
});


  if (isPending) return 'Loading...';
  if (error) return 'An error has occurred: ' + error.message;

 const handleSubmit = (e) => {
  e.preventDefault();
  
  // Check if user is logged in
  if (!user) {
     toast.error("Please login to add comments");
       // Use navigate (lowercase) from useNavigate hook
      navigate("/login");
    return; // Stop execution if user is not logged in
  }
  
  const formData = new FormData(e.target);
  const data = {
    desc: formData.get("desc"),
  };
  
  commentMutation.mutate(data);
  e.target.reset();
};

  return(
    <div className="flex flex-col gap-8 lg:w-3/5 h-[70vh]">
       {/* Comment button */}
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg
         text- font-medium text-gray-600 hover:bg-gray-100 transition-colors">
          <svg
           xmlns="http://www.w3.org/2000/svg"
            width="40"
             height="40"
              viewBox="0 0 24 24"
               fill="none" 
               stroke="currentColor" 
               strokeWidth="4"
               className=""
               >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        {(data?.length || 0)}
        </button>
      <div className=" overflow-auto flex-1">

      {/* Display comments */}
      
        
      {data.map((comment) => (
        <Comment 
          key={comment._id} 
          comment={comment} 
          postId={postId}
        />
      ))}

      </div>
        <form onSubmit={handleSubmit} className="flex items-center justify-between gap-8 w-full mb-4">
          <textarea
            name="desc"
            placeholder="Write a comment..." 
            className="w-full p-4 rounded-xl"
            required
          />
          <button className="bg-blue-800 px-4 py-3 text-white font-medium rounded-xl">
            Send
          </button>
        </form>
    
      
    
    </div>
  );
};

export default Comments;