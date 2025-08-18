import { useAuth, useUser } from "@clerk/clerk-react";
import { Image } from "@imagekit/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { format } from "timeago.js";

const Comment = ({ comment, postId }) => {
const { user } = useUser();
const { getToken } = useAuth();
const role = user?.publicMetadata?.role;

    if (!comment) return null;
    

    const queryClient = useQueryClient();

     const mutation = useMutation({
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
     queryClient.invalidateQueries({queryKey: ["comments", postId] });
      toast.success( "Comment deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response.data);
    },
  });

    return (
        <div className="p-2 mb-4 bg-blue-800 rounded-xl">
            <div className="flex items-center gap-4">
                {comment.user.img && (
                <Image
                    urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}
                    src={comment.user.img}
                    className="w-10 h-10 rounded-full object-cover"
                    alt="User avatar"
                />)}
                <span className="font-medium text-white">
                    {comment.user.username}
                </span>
                <span className="text-sm text-gray-300">
                    {format(comment.createdAt)}
                </span>
                {user && (comment.user.username === user.username || role === "admin") && 
                <span 
              className="text-xs text-red-300 hover:text-red-500 cursor-pointer"
              onClick={() => mutation.mutate()}
                disabled={mutation.isPending}
      >
                {mutation.isPending ? "Deleting..." : "Delete"}
          </span>

}
            </div>
            <div className="mt-4 text-white">
                <p>{comment.desc}</p>
            </div>
        </div>
    );
};

export default Comment;