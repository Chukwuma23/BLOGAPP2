import { Image } from '@imagekit/react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { format } from 'timeago.js';
import LoadingSpinner from '../loadingSpinner/loadingSpinner';

const FeaturedPost = () => {
  const fetchPost = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts?featured=true&limit=4&sort=newest`)
    return res.data;
  };

  const { isPending, error, data } = useQuery({
    queryKey: ["featuredPosts"],
    queryFn: () => fetchPost(),
  });

  if (isPending) return  <LoadingSpinner text="Loading content please wait..." />;
  if (error) return 'An error has occurred: ' + error.message;

  const posts = data?.posts || [];
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 flex flex-col lg:flex-row gap-7">
      {/** FIRST POST */}
      {posts[0] && (
        <div className="w-full flex flex-col gap-4 items-center">
          {posts[0].coverImage && (
            <Image
              urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}
              src={posts[0].coverImage}
              className="w-5/6 rounded-3xl object-cover md:w-4/6 md:h-3/6 lg:h-5/6 lg:w-5/6 xl:h-5/6 xl:w-5/6"
              alt="logo"
            />
          )}
          <div className='text-sm flex items-center gap-2'>
            <h1 className='font-semi-bold lg:text-base'>01.</h1>
            <Link className='text-blue-800 lg:text-md'>{posts[0].category || 'Uncategorized'}</Link>
            <span className='text-gray-500'>{format(posts[0].createdAt)}</span>
          </div>
          <Link to={posts[0].slug} className='text-lg lg:text-lg font-semi-bold lg:font-bold'>
            {posts[0].title}
          </Link>
        </div>
      )}

      {/** OTHER POSTS */}
      <div className='lg:w-3/4 flex flex-rol md:flex-col lg:flex-col gap-5'>
        {/** SECOND POST */}
        {posts[1] && (
          <div className='flex justify-between gap-4'>
            {posts[1].coverImage && (
              <div className='w-5/6 aspect-video'>
                <Image
                  urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}
                  src={posts[1].coverImage}
                  className="lg:w-5/6 lg:-5/6 xl:-5/6 w-full md:w-4/6 rounded-3xl object-cover aspect-video"
                  alt="logo"
                />
              </div>
            )}
            <div className='w-2/3'>
              <div className='flex items-center gap-2 mb-4'>
                <h1 className='font-semi-bold'>02.</h1>
                <Link className='text-blue-800 sm:text-sm'>{posts[1].category || 'Uncategorized'}</Link>
                <span className='text-gray-500 text-md'>{format(posts[1].createdAt)}</span>
              </div>
              <Link to={posts[1].slug} className='text-base sm:text-md md:text-md lg:text-md xl:text-lg font-medium'>
                {posts[1].title}
              </Link>
            </div>
          </div>
        )}

        {/** THIRD POST */}
        {posts[2] && (
          <div className='flex justify-between gap-4'>
            {posts[2].coverImage && (
              <div className='w-full  aspect-video'>
                <Image
                  urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}
                  src={posts[2].coverImage}
                  className="lg:w-5/6 lg:-5/6 w-full md:w-4/6 rounded-3xl object-cover aspect-video"
                  alt="logo"
                />
              </div>
            )}
            <div className='w-2/3'>
              <div className='flex items-center gap-2 mb-4'>
                <h1 className='font-semi-bold'>03.</h1>
                <Link className='text-blue-800 sm:text-sm'>{posts[2].category || 'Uncategorized'}</Link>
                <span className='text-gray-500 text-md'>{format(posts[2].createdAt)}</span>
              </div>
              <Link to={posts[2].slug} className='text-base sm:text-md md:text-md lg:text-md xl:text-lg font-medium'>
                {posts[2].title}
              </Link>
            </div>
          </div>
        )}

        {/** FOURTH POST */}
        {posts[3] && (
          <div className='flex justify-between gap-4'>
            {posts[3].coverImage && (
              <div className='w-full  aspect-video'>
                <Image
                  urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}
                  src={posts[3].coverImage}
                  className="lg:w-5/6 lg:-5/6 w-full md:w-4/6 rounded-3xl object-cover aspect-video"
                  alt="logo"
                />
              </div>
            )}
            <div className='w-2/3'>
              <div className='flex items-center gap-2 mb-4'>
                <h1 className='font-semi-bold'>04.</h1>
                <Link className='text-blue-800 sm:text-sm'>{posts[3].category || 'Uncategorized'}</Link>
                <span className='text-gray-500 text-md'>{format(posts[3].createdAt)}</span>
              </div>
              <Link to={posts[3].slug} className='text-base sm:text-md md:text-md lg:text-md xl:text-lg font-medium'>
                {posts[3].title}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedPost;