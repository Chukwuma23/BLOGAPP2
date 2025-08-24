import { Link } from "react-router-dom";
import '../index.css';
import Categories from "../components/Categories";
import FeaturedPost from "../components/FeaturedPost";
import PostList from "../components/PostList";

const HomePage = () => {
    return(
        <div className=" mt-4 flex flex-col">
            <div className=" flex gap-4 ">
                <Link to="/">Home</Link>
                <span>*</span>
                <span className="text-blue-800">Blog and Articles</span>
            </div>
                {/** Introductions */}
               <div className=" flex items-center justify-between">
                {/** titles */} 
                <div className="">
                <h1 className="text-grey-800 text-2xl md:text-5xl lg:text-6xl font-bold">
                    Web develpment and AI intergration logic.
                    </h1> 
                <p className="mt-8 text-sm text-md md:text-xl text-grey-800">
                    Featured posts
                    </p>
                </div>
               
                 {/** animated button */}
                  <Link to="write" className="relative left-5 hidden md:block">
                   {/** CIRCLE */}
                  <svg 
                  viewBox="0 0 200 200 "
                  width="200"
                  height="200"
                  className="text-lg tracking-widest  animate-spin  origin-center animatedButton"
                  >
                  <path 
                  id="circlePath"
                  fill="none"
                  d="M 20, 100 a -75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
                  /> 
                  <text>
                    <textPath className="bg-red-800" href="#circlePath" startOffset="0%">Tell your story.</textPath>
                     <textPath href="#circlePath" startOffset="50%">Shear your ideas.</textPath>
                     </text>
                      </svg>
                      <button className="bg-blue-800 rounded-full flex items-center justify-center absolute top-14 left-14 right-12 botton-0 n-auto w-20 h-20">
                        <svg
                        xmlns="http://wwww.w3.org/2000/svg"
                        viewBox="0 0  26 19"
                        width="50"
                        height="50"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        >
                         <polyline  points="9 6 18 6 18 15  " />
                        </svg>
                      </button>
                  </Link>
                   </div>
                    {/** CATEGORY */}
                   <Categories />
                    {/** FEATURED POST */}
                    <FeaturedPost />
                     {/** POST list*/}
                     <div className="relative  w-full">
                         <h1 className="tex-t2xl text-gray-600">Recent Post</h1>
                         <PostList />
                     </div>
        </div>
    );
};

export default HomePage;