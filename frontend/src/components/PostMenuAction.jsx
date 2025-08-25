import { useUser, useAuth } from "@clerk/clerk-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const PostMenuAction = ({post}) => {
  const {user} = useUser();
  const {getToken} = useAuth();
  const navigate = useNavigate(); 

  const {isPending, error, data: savedPosts} = useQuery({
    queryKey: ["savedPosts"],
    queryFn: async () => {
      const token = await getToken();
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/saved`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data; // Return just the data part
    },
  });

    const isAdmin = user?.publicMetadata?.role === "admin" || false;

  const isSaved = Array.isArray(savedPosts) 
    ? savedPosts.some((p) => p?.toString() === post._id?.toString())
    : false;

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return axios.delete(
        `${import.meta.env.VITE_API_URL}/posts/${post._id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: () => {
      toast.success("Post deleted successfully");
      navigate("/");
    },
    onError: (error) => {
      toast.error(error.response.data);
    },
  });
  



const queryClient = useQueryClient();

     const saveMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return axios.patch(
        `${import.meta.env.VITE_API_URL}/users/save`,
         { postId: post._id },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: (data) => {
  console.log('Feature response:', data);
  queryClient.invalidateQueries({queryKey: ["post", post.slug] });
  toast.success(post.isFeatured ? "Post unfeatured" : "Post featured");
},
    onError: (error) => {
      toast.error(error.response.data);
    },
  });


  const featureMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return axios.patch(
        `${import.meta.env.VITE_API_URL}/posts/feature`,
         { postId: post._id },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: () => {
     queryClient.invalidateQueries({queryKey: ["post", post.slug] });
      toast.success(post.isFeatured ? "Post unfeatured" : "Post featured");
    },
    onError: (error) => {
      toast.error(error.response.data);
    },
  });

 const  handleDelete = () => {
   if (window.confirm(`Are you sure you want to delete this post?`)) {
    deleteMutation.mutate();
   }
  }

   const  handlefeature = () => {
    featureMutation.mutate();
  }

      const handleSave = () => {
        if(!user){
          return navigate("/login")
        }
    saveMutation.mutate();
  }

  

  // edit post function
const editMutation = useMutation({
  mutationFn: async () => {
    navigate(`/edit/${post._id}`);
  }
});

const handleEdit = () => {
  editMutation.mutate();
};

  return(
    <div className="">
      <h1 className="mt-8 mb-4 text-sm font-medium">Actions</h1>
      {isPending ? (
        "Loading..."
      ) : error ? (
       <p className="text-red-500"> Action features fetching failed! <br />(Unauthorize user or network error!)</p>
      ) : (
        <div className="flex items-center gap-2 py-2 text-sm cursor-pointer"  onClick={handleSave}>
          <svg xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="white"
            stroke="black"
    >
          
            <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"
              fill={isSaved ? "black" : "none"}
            />
          </svg>
             <span>{isSaved ? 'Unsave this post' : 'Save this post'}</span>
        {saveMutation.isPending && <span className="text-sm"> (In progress...)</span>}
        </div>
      )}

      {user && (post.user?.username === user.username || isAdmin) && (
        <div className="flex items-center gap-2 py-2 text-sm cursor-pointer"
          onClick={handleDelete}
        >
          <svg xmlns="http://www.w3.org/2000/svg" 
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="red"
            stroke="red"
    >
          
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
          </svg>
          <span>Delete this post</span>
          {deleteMutation.isPending && <span className="text-sm"> (in progress....)</span>}
        </div>
      )}

      {isAdmin && (
  <div 
    className="flex items-center gap-2 text-sm py-2 cursor-pointer"
    onClick={handlefeature}
  >
    <svg 
      width="24"
      height="24" 
      viewBox="0 0 24 24" 
      xmlns="http://www.w3.org/2000/svg"
      strokeWidth="white"
      stroke="black"
    >
      <path 
        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
        fill={post.isFeatured ? "blue" : "none"}
      />
    </svg>
    <span>{post.isFeatured ? 'Unfeature' : 'Feature'}</span>
    {featureMutation.isPending && <span className="text-sm"> (In progress...)</span>}
  </div>
)}

  {/**edit post */}
{user && (post.user?.username === user.username || isAdmin) && (
  <div className="flex items-center gap-2 py-2 text-sm cursor-pointer"
    onClick={handleEdit}
  >
    <svg xmlns="http://www.w3.org/2000/svg" 
      width="24"
      height="24"
      viewBox="0 0 24 24"
      strokeWidth="blue"
      stroke="blue"
    >
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
    </svg>
    <span>Edit this post</span>
  </div>
)}
    </div>
  );
};

export default PostMenuAction;