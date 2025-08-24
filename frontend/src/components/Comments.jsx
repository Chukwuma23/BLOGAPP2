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

const Comments = ({postId}) => {
  const {user} = useUser();  
  const {getToken} = useAuth();
   const navigate = useNavigate();
  
  const {isPending, error, data} = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments(postId),
  })

  const queryClient = useQueryClient();

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
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['comments', postId]});
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
     <h1 className="text-xl text-gray-500 underline">Comments</h1>
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