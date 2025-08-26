import { Link, useSearchParams } from "react-router-dom";
import Search from "./Search";
import ErrorPage from "../Routes/ErrorPage";

const SideMenu = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleFilterChange = (e) => {
    try{
    if (searchParams.get("sort") !== e.target.value) {
    setSearchParams({
      ...Object.fromEntries(searchParams.entries()),
      sort: e.target.value,
    });
   }
  }catch(error){
  <ErrorPage />
  }
};


const handleCategoryChange = (category) => {
    try{
    if (searchParams.get("cat") !== category) {
    setSearchParams({
      ...Object.fromEntries(searchParams.entries()),
      cat:category,
    });
   }
  }catch(error){
  <ErrorPage />
  }
};
    return(
        <div className="px-4 h-max sticky top-8">
       <h1 className=" text-lg font-semibold mb-2">Search</h1>
       <Search />
       <h1 className=" text-lg font-semibold mt-4">Filter</h1>

<div className="flex flex-col gap-4 text-sm">
  <label htmlFor="" className="flex items-center gap-2 cursor-pointer">
  <input 
    type="radio" 
    name="sort" 
    onChange={handleFilterChange} 
    value="newest" 
    className="appearance-none w-4 h-4 border-[1.5px] border-blue-800 checked:bg-blue-500 bg-white" 
  />
  Newest
</label>
<label htmlFor="" className="flex items-center gap-2 cursor-pointer">
  <input 
    type="radio" 
    name="sort" 
    onChange={handleFilterChange} 
    value="popular"  // Changed from "web-design"
    className="appearance-none w-4 h-4 border-[1.5px] border-blue-800 bg-white checked:bg-blue-500" 
  />
  Most popular
</label>
<label htmlFor="" className="flex items-center gap-2 cursor-pointer">
  <input 
    type="radio" 
    name="sort" 
    onChange={handleFilterChange} 
    value="trending"  // Changed from "development"
    className="appearance-none w-4 h-4 border-[1.5px] border-blue-800 bg-white checked:bg-blue-500" 
  />
  Trending
</label>
<label htmlFor="" className="flex items-center gap-2 cursor-pointer">
  <input 
    type="radio" 
    name="sort" 
    onChange={handleFilterChange} 
    value="oldest"  // Changed from "database"
    className="appearance-none w-4 h-4 border-[1.5px] border-blue-800 bg-white checked:bg-blue-500" 
  />
  Oldest
</label>  
         </div>
          <h1 className="m-4 text-sm font-medium">Categories</h1>
            <div className="flex flex-col gap-1 text-md">
           <Link className="underline cursor-pointer"  onClick={() => handleCategoryChange("general") }>All</Link>
          <Link className="underline cursor-pointer"  onClick={() => handleCategoryChange("development") }>Development</Link>
          <Link className="underline cursor-pointer"  onClick={() => handleCategoryChange("health") }>Health</Link>
          <Link className="underline cursor-pointer"  onClick={() => handleCategoryChange("marketing") }>Marketing</Link>
          <Link className="underline cursor-pointer"  onClick={() => handleCategoryChange("web-design") }>Web design</Link>
          <Link className="underline cursor-pointer"  onClick={() => handleCategoryChange("sport") }>Sports</Link>
            </div>
        </div>
    );
};

export default SideMenu;