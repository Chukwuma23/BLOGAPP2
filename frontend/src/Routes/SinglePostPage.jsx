import { Link, useParams } from "react-router-dom";
import { Image } from '@imagekit/react';
import PostMenuAction from "../components/PostMenuAction";
import Search from "../components/Search";
import Comments from "../components/Comments";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { format } from "timeago.js";
import LoadingSpinner from "../loadingSpinner/loadingSpinner";


const fetchPost = async (slug) => {
  // Use 'page' instead of 'cursor' to match backend
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts/${slug}`)
  return res.data;
};


const SinglePostPage = () => {

const {slug} = useParams();

 const {isPending, error, data} = useQuery({
        queryKey: ["post", slug],
        queryFn: () => fetchPost(slug),
    })

      if (isPending) return  <LoadingSpinner text="Loading content..." />;
      if (error) return 'An error has occurred: ' + error.message;
      if (!data) return 'Post not found!';

    return(
        <div className="flex flex-col gap-8 mt-10 ">
             {/* DATAILS */}
            <div  className="flex gap-8 ">
                <div  className="lg:w-3/5 flex flex-col gap-8">
                 <h1 className="text-xl text-sm md:text-3xl xl:text-4xl  font-semibold">
                    {data.title}
                    </h1> 
                    <div className="flex items-center gap-4 text-gray-400 text-md">
                        <span>Written by:</span>
                <Link className="text-blue-800 ">{data.user?.username || 'Unknown Author'} </Link>
                <span>On:</span>
                <Link className="text-blue-800 ">{data.category || 'Uncategorized'} </Link>
                 <span>{format(data.createdAt)}</span>
                        </div>  
                        <p className="text-black-300 text-base  font-medium">{data.desc} </p>
                </div> 
               {data.coverImage && <div  className="hidden lg:block w-full">
                <Image 
                                        urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}
                                        src={data.coverImage}
                                        w="600"
                                        h="200"
                                        className="rounded-2xl lg:w-4/6 md:w-5/6" 
                                        alt={data.title}
                                        loading="lazy"
                                    />
                </div>}
                </div> 
                  {/* CONTENT */}
            <div className="flex flex-col md:flex-row gap-8">
              <div className="lg:text-lg text-base flex flex-col gap-6 text-justify">
              <div 
                   className="text-black-500 font-medium"
                       dangerouslySetInnerHTML={{ __html: data.content }} 
                />
                </div>
                  {/* menu */}
                  <div className=" px-4  h-max sticky top-8 ">
                    <h1 className=" mb-4 text-sm font-medium">Auther</h1>
                    <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                         {data.user?.image &&   <Image 
                                        urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}
                                        src={data.user?.image}
                                        w="48"
                                        h="48"
                                        className=" w-12
                                        h-12 rounded-full object-cover" 
                                        alt="logo" 
                                        loading="lazy"
                                    />}
                                    <Link className="text-blue-800">{data.user?.username || 'Unknown Author'}</Link>
                             </div>

                                    <p className=" text-sm text-500">This is just a text for the auther page</p>
                            <div className="flex gap-2">
                                <Link>
                                 <Image 
                                        urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}
                                        src='/instagram.svg'
                                        className=" " 
                                        alt="logo"
                                        width="20"
                                        height="20"
                                        loading="lazy"
                                    />
                                </Link>
                                  <Link>
                                 <Image 
                                        urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}
                                        src='/facebook.svg'
                                        className=" " 
                                        alt="logo" 
                                         width="20"
                                        height="20"
                                        loading="lazy"
                                    />
                                </Link>
                                </div>
                        </div>
                        <PostMenuAction post={data}/>
                        <h1 className="mt-2 mb-4 text-sm font-medium">Category</h1>
                       <div className="flex flex-col gap-1 text-md">
                         <Link className="underline">All</Link>
                          <Link className="underline" to="/">Web Design</Link>
                          <Link className="underline" to="/">Development</Link>
                          <Link className="underline" to="/">Database</Link>
                          <Link className="underline" to="/">Marketing</Link>
                          <Link className="underline" to="/">API</Link>
                          <Link className="underline" to="/">Search engine</Link>
                       </div>
                       <h1 className="mt-8 mb-4 text-sm font-medium">Search</h1>
                       <Search />
                  </div>
             </div>
              <Comments postId={data._id}/>  
        </div>
    )
}

export default SinglePostPage;