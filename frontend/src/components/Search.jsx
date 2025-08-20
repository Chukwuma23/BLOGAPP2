import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

 const handlKeyPress = (e) => {
  if (e.key === "Enter") {
    const query = e.target.value;
    if (location.pathname === "/posts") {
      setSearchParams({...Object.fromEntries(searchParams), search: query});
    } else {
      navigate(`/posts?search=${query}`);
    }
  }
 };
    return(
        <div className="bg-gray-100 py-2 rounded-full flex items-center gap-2">
  <svg className="relative top-0 left-2" xmlns="http://www.w3.org/2000/svg"
   width="20"
    height="20"
     viewBox="0 0 24 24"
     stroke="gray">
    <path
     d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91
      16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99
       5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
    />
  </svg>
  <input type="text"
   placeholder="Search a post"
    className="text-center bg-transparent"
  onKeyDown={handlKeyPress}
  />
</div>



        
    );
};

export default Search;