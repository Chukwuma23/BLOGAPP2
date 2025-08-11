import { Link } from "react-router-dom";

const Categories = () => {
    return(
        <div className="hidden md:flex bg-white  md:rounded-2xl xl:rounded-full p-4 shadow-lg items-center justify-center gap-8">
                    {/** LINKS */}
                    <div className=" flex items-center justify-center flex-wrap">

                      <Link
                       to="/posts"
                       className="bg-blue-800 text-white rounded-full px-4 py-2"
                       >All posts
                       </Link>
                       <Link
                        to="/postscat=web-design"
                       className="hover:bg-blue-800 hover:text-white rounded-full px-4 py-2"
                       >Web design
                       </Link> 
                       <Link
                        to="/posts?cat=development"
                       className="hover:bg-blue-800 hover:text-white rounded-full px-4 py-2"
                       >Development
                       </Link>
                         <Link
                        to="/posts?cat=database"
                       className="hover:bg-blue-800 hover:text-white rounded-full px-4 py-2"
                       >Database
                       </Link>
                        <Link
                        to="/posts?cat=search-engines"
                       className="hover:bg-blue-800 hover:text-white rounded-full px-4 py-2"
                       >Search Engines
                       </Link> 
                       <Link
                        to="/posts?cat=marketing"
                       className="hover:bg-blue-800 hover:text-white rounded-full px-4 py-2"
                       >Marketing
                       </Link> 
                        <Link
                        to="/posts?cat=machine-learning"
                       className="hover:bg-blue-800 hover:text-white rounded-full px-4 py-2"
                       >AI: Machine Learning
                       </Link> 
                        </div>
                        <span className="text-xl font-medium">|</span>
                    <div className="bg-gray-100 rounded-full px-4 py-2 flex itens-center gap-2" >
                        
                           <svg
                        xmlns="http://wwww.w3.org/2000/svg"
                        viewBox="0 0  24 24"
                        width="20"
                        height="20"
                        fill="none"
                        stroke="gray"
                        >
                         <circle cx="10.5" cy="10.5" r="7.5"/>   
                         <line  x1="0"  x2="9" y2="15" y1="49"/>
                        </svg>
                        <input type="text" placeholder="Search a post..." className="bg-transparent"/>
                        </div>
            </div>
            
    )
}

export default Categories;