import { Link } from "react-router-dom";
import { Image } from '@imagekit/react';
import PostMenuAction from "../components/PostMenuAction";
import Search from "../components/Search";
import Comments from "../components/Comments";
const SinglePostPage = () => {
    return(
        <div className="flex flex-col gap-8">
             {/* DATAILS */}
            <div  className="flex gap-8 ">
                <div  className="lg:w-3/5 flex flex-col gap-8">
                 <h1 className="text-xl md:text-3xl xl:text-4xl 2xl:text-5xl font-semibold">
                    this is just a single post heading and is special in my heart
                    </h1> 
                    <div className="flex items-center gap-4 text-gray-400 text-md">
                        <span>Written by:</span>
                <Link className="text-blue-800 ">Chima kalu</Link>
                <span>On:</span>
                <Link className="text-blue-800 ">Wed design</Link>
                 <span>2 days ago</span>
                        </div>  
                        <p className="text-gray-500 font-medium">this is just a single post heading and is special in my heart.
                            this is just a single post heading and is special in my heart
                            this is just a single post heading and is special in my heart
                        </p>
                </div> 
                <div className="hidden lg:block w-2/3">
                     <Image 
                                        urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}
                                        src='/featured3.jpeg'
                                        w="600"
                                        h="200"
                                        className="rounded-2xl" 
                                        alt="logo" 
                                    />
                </div>
                </div> 
                  {/* CONTENT */}
            <div className="flex flex-col md:flex-row gap-8">
              <div className="lg:text-lg flex flex-col gap-6 text-justify">
                 <p className="text-gray-500 font-medium">this is just a single post heading and is special in my heart.
                            this is just a single post heading and is special in my heart
                            this is just a single post heading and is special in my heart
                        </p>
                         <p className="text-gray-500 font-medium">this is just a single post heading and is special in my heart.
                            this is just a single post heading and is special in my heart
                            this is just a single post heading and is special in my heart
                        </p>
                         <p className="text-gray-500 font-medium">this is just a single post heading and is special in my heart.
                            this is just a single post heading and is special in my heart
                            this is just a single post heading and is special in my heart
                        </p>
                         <p className="text-gray-500 font-medium">this is just a single post heading and is special in my heart.
                            this is just a single post heading and is special in my heart
                            this is just a single post heading and is special in my heart
                        </p>

                          <p className="text-gray-500 font-medium">this is just a single post heading and is special in my heart.
                            this is just a single post heading and is special in my heart
                            this is just a single post heading and is special in my heart
                        </p>
                         <p className="text-gray-500 font-medium">this is just a single post heading and is special in my heart.
                            this is just a single post heading and is special in my heart
                            this is just a single post heading and is special in my heart
                        </p>
                         <p className="text-gray-500 font-medium">this is just a single post heading and is special in my heart.
                            this is just a single post heading and is special in my heart
                            this is just a single post heading and is special in my heart
                        </p>
                         <p className="text-gray-500 font-medium">this is just a single post heading and is special in my heart.
                            this is just a single post heading and is special in my heart
                            this is just a single post heading and is special in my heart
                        </p>
                          <p className="text-gray-500 font-medium">this is just a single post heading and is special in my heart.
                            this is just a single post heading and is special in my heart
                            this is just a single post heading and is special in my heart
                        </p>
                         <p className="text-gray-500 font-medium">this is just a single post heading and is special in my heart.
                            this is just a single post heading and is special in my heart
                            this is just a single post heading and is special in my heart
                        </p>
                         <p className="text-gray-500 font-medium">this is just a single post heading and is special in my heart.
                            this is just a single post heading and is special in my heart
                            this is just a single post heading and is special in my heart
                        </p>
                         <p className="text-gray-500 font-medium">this is just a single post heading and is special in my heart.
                            this is just a single post heading and is special in my heart
                            this is just a single post heading and is special in my heart
                        </p>
                </div>
                  {/* menu */}
                  <div className=" px-4  h-max sticky top-8 ">
                    <h1 className=" mb-4 text-sm font-medium">Auther</h1>
                    <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                          <Image 
                                        urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}
                                        src='/featured4.jpeg'
                                        w="48"
                                        h="48"
                                        className=" w-12
                                        h-12 rounded-full object-cover" 
                                        alt="logo" 
                                    />
                                    <Link>Chima kalu</Link>
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
                                    />
                                </Link>
                                </div>
                        </div>
                        <PostMenuAction />
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
              <Comments />  
        </div>
    )
}

export default SinglePostPage;