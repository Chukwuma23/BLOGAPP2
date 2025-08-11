import { Image } from "@imagekit/react";

const Comment = () => {
    return(
        <div className="p-2 mb-4 bg-blue-800 rounded-xl">
        <div className="flex items-center gap-4">
          <Image
               urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}
                        src='/featured3.jpeg'
                               className="w-10 h-10 rounded-full object-cover " 
                               alt="logo" 
                                             />  
                                             <span className="font-meduim text-white">Ikechukwu kalu</span> 
                                              <span className="text-sm text-gray-500 text-white">3 days ago</span> 
        </div>
        <div className="mt-4 text-white">
            <p>This topic is intersting and educative,
                 thanks for shearing chukwumama kalu
                 </p>
        </div>
        </div>
    );
};

export default Comment;