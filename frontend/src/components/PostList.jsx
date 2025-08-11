import PostListItems from "./PostListItems";
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchPosts = async () => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts`); // Adjust the endpoint as needed
  return res.data;
};

const PostList = () => {

    const { isPending, error, data } = useQuery({
    queryKey: ['repoData'],
    queryFn: fetchPosts,
  })

  if (isPending) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message

  console.log('Fetched posts:', data);
    return(
        <div className="flex flex-col gap-8 md-8 items-center justify-center">
        <PostListItems />
         <PostListItems />
        <PostListItems />
         <PostListItems />
         <PostListItems />
         <PostListItems />
         <PostListItems />
         <PostListItems />
        </div>
    );
};

export default PostList;