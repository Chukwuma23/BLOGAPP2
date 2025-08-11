import { Link } from "react-router-dom";
import Search from "./Search";

const SideMenu = () => {
    return(
        <div className="px-4 h-max sticky top-8">
       <h1 className=" text-lg font-semibold mb-2">Search</h1>
       <Search />
       <h1 className=" text-lg font-semibold mt-4">Filter</h1>
       <div className="flex flex-col gap-4 text-sm">
             <label htmlFor="" className="flex items-center gap-2 cursor-pointer">
               <input type="radio" 
               name="sort" 
               value="newest" 
               className="appearance-none w-4 h-4 border-[1.5px] border-blue-800 checked:bg-blue-500 bg-white" />
               Newest
           </label>
          <label htmlFor="" className="flex items-center gap-2 cursor-pointer">
            <input type="radio" 
            name="sort" 
            value="web-design" 
            className="appearance-none w-4 h-4 border-[1.5px] border-blue-800 bg-white checked:bg-blue-500" />
            Most popular
          </label>
          <label htmlFor="" className="flex items-center gap-2 cursor-pointer">
            <input type="radio" 
            name="sort" 
            value="development" 
            className="appearance-none w-4 h-4 border-[1.5px] border-blue-800 bg-white checked:bg-blue-500" />
            Trending
          </label>
          <label htmlFor="" className="flex items-center gap-2 cursor-pointer">
            <input type="radio" 
            name="sort" 
            value="database" 
            className="appearance-none w-4 h-4 border-[1.5px] border-blue-800 bg-white checked:bg-blue-500" />
            Oldest
          </label>
            <label htmlFor="" className="flex items-center gap-2 cursor-pointer">
            <input type="radio" 
            name="sort" 
            value="database" 
            className="appearance-none w-4 h-4 border-[1.5px] border-blue-800 bg-white checked:bg-blue-500" />
            All
          </label>
         </div>
          <h1 className="m-4 text-sm font-medium">Categories</h1>
            <div className="flex flex-col gap-1 text-md">
                <Link className="underline" to="/post">All</Link>
                <Link className="underline" to="/post?cat=web-design">Web Design</Link>
                <Link className="underline" to="/post?cat=development">Development</Link>
                <Link className="underline" to="/post?cat=database">Database</Link>
                <Link className="underline" to="/post?cat=marketing">Marketing</Link>
                <Link className="underline" to="/post?cat=api">API</Link>
                <Link className="underline" to="/post?cat=search-engine">Search engine</Link>
            </div>
        </div>
    );
};

export default SideMenu;