import PostListItems from "./PostListItems";
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';

const fetchPosts = async (pageParam) => {
  // Use 'page' instead of 'cursor' to match backend
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, {
    params: {
      page: pageParam + 1, // pageParam starts at 0, backend expects 1-based
      limit: 10,
    },
  });
  return res.data;
};

const PostList = () => {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasMore ? pages.length : undefined,
  });
console.log('PostList data:', data);

  if (status === 'loading') return 'Loading...'

  if (status === 'error') return 'An error has occurred: ' + error.message

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
      loader={<h4>Loading more posts...</h4>}
      endMessage={
        <p style={{ textAlign: 'center' }}>
          <b>All posts loaded</b>
        </p>
      }
    >
      {uniquePosts.map(post => post && post._id && (
        <PostListItems key={post._id} post={post} />
      ))}
    </InfiniteScroll>
  );
};

export default PostList;