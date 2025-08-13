import { Image } from "@imagekit/react";
import { format } from "timeago.js";

const Comment = ({ comment }) => {
    if (!comment) return null;
    
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
            </div>
            <div className="mt-4 text-white">
                <p>{comment.desc}</p>
            </div>
        </div>
    );
};

export default Comment;