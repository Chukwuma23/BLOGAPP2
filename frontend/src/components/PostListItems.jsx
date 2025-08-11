import { Image } from "@imagekit/react";
import { Link } from "react-router-dom";
const PostListItems = () => {
    return(
        <div className=" flex flex-col xl:flex-row gap-8 md:gap-12 items-center justify-center">
            {/* image */}
       <div className="md:hidden xl:block relative  items-center justify-center">
         <Image
            urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}
              src='/featured2.jpeg'
                 className="rounded-2xl object-cover " 
                            alt="logo" 
                       />
       </div>
         {/* Details */}
         <div className=" flex-col flex gap-4 mb-4">
            <Link className="text-2xl font-semibold">
            This is a text to test the post list and compatibility and features
            </Link>
            <div className="flex items-center gap-6 text-gray-400 text-sm ">
                <span>Written by:</span>
                <Link className="text-blue-800 ">Chima kalu</Link>
                <span>On:</span>
                <Link className="text-blue-800 ">Wed design</Link>
                 <span>2 days ago</span>
            </div>
            <p>Web develpment and AI intergration logic.
                This is a random text for my blog website and it is
                 special to me, thank for reading.
                 This just a text for testing abount the title of the page
                    This text is just for testing my application
            </p>
            <Link to="/test" className="underline text-blue-800 text-sm">Read more</Link>
         </div>
        </div>
    );
};

export default PostListItems;