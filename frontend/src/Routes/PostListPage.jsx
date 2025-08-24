import React, { useState } from "react";
import PostList from "../components/PostList";
import SideMenu from "../components/SideMenu";
const PostListPage = () => {
  const [open, setOpen] = useState(false);
    return(
        <div className="itema-center">
          <h1 className="mb-8 text-2xl">Development Blog</h1>
          <button onClick={() => setOpen(prev => !prev)} className="bg-blue-800 m-4 text-white px-4 py-2 rounded-lg text-sm md:hidden">
            {open ? "Close Menu" : "Filter or Search Posts"}
          </button>
          <div className="flex flex-col-reverse md:flex-row gap-8">
            {/* Post List */}
            <div className="">
                <PostList />
              </div>
              <div className={`${open ? "block" : "hidden"} md:block`}>
                <SideMenu />
              </div>
               </div>
         </div>
    
    );
};

export default PostListPage;
