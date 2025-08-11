import { Image } from '@imagekit/react';
import { Link } from 'react-router-dom';
const FeaturedPost = () => {
    return(
        <div className=" mt-4 flex flex-col lg:flex-row gap-4">
          {/** FIRST */}
          <div className="w-full flex flex-col gap-4 items-center">
             {/** IMAGE */}
             <Image
               urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}
                    src='/featured2.jpeg'
                    className="w-5/6 rounded-3xl object-cover md:w-3/6 md:h-3/6 lg:h-5/6 lg:w-5/6 xl:h-5/6 xl:w-5/6 " 
                    alt="logo" 
               />
              {/** datails */}
              <div className='text-sm flex items-center gap-2'>
                <h1 className='font-semi-bold lg:text-base'>01.</h1>
                <Link  className='text-blue-800 lg:text-md '> Web design</Link>
                <span className='text-gray-500'>2 day ago</span>
              </div>
               {/** title */}
                <Link to="/test"
               className='text-lg lg:text-lg font-semi-bold lg:font-bold'
               >
                This just a text for testing abount the title of the page
                </Link>
          </div>
           {/** Others */}
          <div className=' lg:w-1/2 flex flex-col gap-5'>
                 {/** Second */}
            <div className='flex justify-between gap-4'>
                 <Image
                   urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}
                    src='/featured2.jpeg'
                    className="lg:w-5/6 lg:-5/6 w-3/6 rounded-3xl object-cover aspect-video" 
                    alt="logo" 
               />
                {/** Details and title */}
               <div className='w-2/3'>
                {/** Details */}
                <div className=' flex items-center gap-2  md-4 '>
                    <h1 className='font-semi-bold'>02.</h1>
                    <Link className='text-blue-800  sm:text-sm'>Development</Link>
                    <span className='text-gray-500 text-md'>3 days ago</span>
                </div>
                    {/** title */}
                    <Link to="/test" className='text-base sm:text-md md:text-md lg:text-md xl:text-lg font-medium'>This text is just for testing my application</Link>
                </div>
                </div>
               {/** Third */}
               <div className='lg:h-1/3 flex justify-between gap-4'>
                <Image
                   urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}
                    src='/featured2.jpeg'
                    className="lg:w-5/6 w-3/6 rounded-3xl object-cover aspect-video" 
                    alt="logo" 
               />
                {/** Details and title */}
               <div className='w-2/3'>
                {/** Details */}
                <div className='flex items-center gap-4  md-4'>
                    <h1 className='font-semi-bold'>02.</h1>
                    <Link className='text-blue-800 '> design</Link>
                    <span className='text-gray-500 text-md'>3 days ago</span>
                </div>
                    {/** title */}
                    <Link to="/test" className='text-base sm:text-md md:text-lg lg:text-base xl:text-lg font-medium'>This text is just for testing my application</Link>
                </div>
               
               </div>
               {/** Fourth */}
                <div className='lg:h-1/3 flex justify-between gap-4'>
                 <Image
                   urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}
                    src='/featured2.jpeg'
                    className="w-3/6 lg:w-5/6 rounded-3xl object-cover aspect-video" 
                    alt="logo" 
               />
                {/** Details and title */}
               <div className='w-2/3'>
                {/** Details */}
                <div className='flex items-center gap-4  md-4'>
                    <h1 className='font-semi-bold'>02.</h1>
                    <Link className='text-blue-800 '>Database</Link>
                    <span className='text-gray-500 text-md'>3 days ago</span>
                </div>
                    {/** title */}
                    <Link to="/test" className='text-base sm:text-lg md:text-lg lg:text-md xl:text-lg '>This text is just for testing my application</Link>
                </div>
                </div>
                
          </div>
        </div>
    );
};

export default FeaturedPost ;