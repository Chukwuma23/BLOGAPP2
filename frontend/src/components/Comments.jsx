import axios from "axios";
import Comment from "../components/comment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "react-toastify";

const fetchComments = async (postId) => {
  // Use 'page' instead of 'cursor' to match backend
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/comments/${postId}`)
  return res.data;
};




const Comments = ({postId}) => {
  const {getToken} = useAuth();
 const {isPending, error, data} = useQuery({
        queryKey: ["comments", postId],
        queryFn: () => fetchComments(postId),
    })

     const queryClient = useQueryClient();

     const mutation = useMutation({
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
           // toast.success('Post created successfully!');
           // navigate(`/${res.data.slug}`);
           queryClient.invalidateQueries({queryKey: ['comments', postId]})
        },
        onError: (error) => {
            console.error('Full error:', error);
            const serverMessage = error.response?.data?.message || 'Error creating post';
            const validationErrors = error.response?.data?.errors;
            
            toast.error(serverMessage);
            if (validationErrors) {
                Object.values(validationErrors).forEach(err => {
                    toast.error(err);
                });
            }
        }
    });

      if (isPending) return 'Loading...';
      if (error) return 'An error has occurred: ' + error.message;
     

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const data = {
      desc: formData.get("desc"),
    };
    mutation.mutate(data)
  }
    return(
        <div className="flex flex-col gap-8 lg:w-3/5">
        <h1 className="text-xl text-gray-500 underline ">Comments</h1>
        <form onSubmit={handleSubmit}
         className="flex items-center justify-between gap-8 w-full">
            <textarea
            name="desc"
             placeholder="write a comment..." className="w-full p-4 rounded-xl"></textarea>
            <button className="bg-blue-800 px-4 py-3 text-white font-medium rounded-xl">
              Send
            </button>
        </form>
        {data.map((comment) => (
             <Comment key={comment._id} comment={comment}/>
        ))}
        </div>
    );
};

export default Comments;