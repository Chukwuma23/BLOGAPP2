import PostListItems from "./PostListItems";
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useSearchParams } from "react-router-dom";
import ErrorPage from "../Routes/ErrorPage.jsx"
import LoadingSpinner from "../loadingSpinner/loadingSpinner.jsx";

const fetchPosts = async (pageParam, searchParams) => {
  try {
    const params = {
      page: pageParam,
      limit: 10,
      ...Object.fromEntries([...searchParams]),
    };

    const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, { params });
    return res.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error; // Let react-query handle it
  }
};

const PostList = () => {
const [ searchParams, setSearchParams ] = useSearchParams();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['posts', searchParams.toString()],
    queryFn: ({pageParam = 1}) => fetchPosts(pageParam, searchParams),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasMore ? pages.length : undefined,
  });
//console.log('PostList data:', data);

  if (status === 'loading') return  <LoadingSpinner text="Loading content..." />

  if (status === 'error') return  <ErrorPage />

  const allPosts = data?.pages.flatMap((page) => page.posts) || [];
  // Filter out duplicate posts by _id
  const uniquePosts = [];
  const seenIds = new Set();
  for (const post of allPosts) {
    if (post && post._id && !seenIds.has(post._id)) {
      uniquePosts.push(post);
      seenIds.add(post._id);
    }
  }

  return(
    <InfiniteScroll 
      dataLength={uniquePosts.length}
      next={fetchNextPage}
      hasMore={!!hasNextPage}
      loader={ <LoadingSpinner text="Fetching more most..." />}
      endMessage={
        <p style={{ textAlign: 'center' }}>
          <b>All posts loaded</b>
        </p>
      }
    >
      {uniquePosts.map(post => post && post._id && (
        <PostListItems  key={post._id} post={post} />
      ))}
    </InfiniteScroll>
  );
};

export default PostList;