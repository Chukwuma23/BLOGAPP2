import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { useAuth, useUser } from "@clerk/clerk-react";
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import { useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify';
import Upload from '../components/Upload';

const Write = () => {
     // Check if the user is loaded and signed in
    const {isLoaded, isSignedIn} = useUser();
    const [value, setValue] = useState('');
    const {getToken} = useAuth();
    const navigate = useNavigate();
    const [cover, setCover] = useState('');
    const [img, setImg] = useState('');
    const [video, setVideo] = useState('');
    const [progress, setProgress] = useState(0);

    // This effect can be used to perform any side effects when the component mounts
    useEffect(() => {
        if (img) {
            // Insert image with width and height attributes
            setValue(prev => prev + `<p><img src="${img}" alt="Image" width="200" height="300" /></p>`);
        }
    }, [img]);

        useEffect(() => {
        if (video) {
            // Insert video with width and height attributes
            setValue(prev => prev + `<p><iframe class="ql-video" src="${video}" alt="Video" width="200" height="300" controls /></p>`);
        }
    }, [video]);
    // Remove auto-insertion of image/video into editor content
    // Instead, show preview below the editor before publishing
        // This effect can be used to perform any side effects when the component mounts
    // Mutation to create a new post
    // This will handle the post creation logic
 const mutation = useMutation({
    // Define the mutation function to create a new post
    // This will be called when the form is submitted
    mutationFn: async (newPost) => {
        // Get the token for authentication
        const token = await getToken();
        // Make a POST request to create a new post
        // Ensure the backend endpoint is set up to handle this request
      return axios.post(`${import.meta.env.VITE_API_URL}/posts`, newPost, {
        // Include the token in the request headers for authentication
        headers: {
            // Authorization header with the Bearer token
          Authorization: `Bearer ${token}`
        },
      })
    },
    // Handle the response after the post is created
    onSuccess: (res) => {
      console.log('Post created successfully:', res.data);
        // Show a success message and navigate to the newly created post
        toast.success('Post created successfully!');
      navigate(`/${res.data.slug}`); // Redirect to the home page or wherever you want after successful post creation
    },
  })


   if (!isLoaded){
       return <div className="text-gray-500 text-lg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">Loading...</div>;
       if (isLoaded && !isSignedIn){
          return <div className="">You should login!</div>;  
       }
   }

    // Function to handle form submission
    // This will be called when the user submits the form to create a new post
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Get the token for authentication
            // Ensure the backend endpoint is set up to handle this request
            const token = await getToken();
            // Create a FormData object to hold the form data
            // This will include the title, category, description, content, cover image, and other
            const formData = new FormData(e.target);
            const data = {
                title: formData.get('title'),
                category: formData.get('category'),
                desc: formData.get('desc'),
                value: value,
                cover,
                img,
                video
            };
            console.log('Submitting data:', data);
            // Call the mutation to create a new post
            // This will send the data to the backend for processing
            mutation.mutate(data, {
                onError: (error) => {
                    console.error('Mutation error:', error);
                },
                onSuccess: (response) => {
                    console.log('Mutation success:', response);
                }
            });
        } catch (err) {
            console.error('Error in handleSubmit:', err);
        }
    };

   
    // Render the Write component
    // This will display the form for creating a new post
    return (
        <div className="h-[calc(100vh-64px)] md:[calc(100vh-80px)] flex flex-col gap-4">
            <h1 className="text-cl font-light ">Create a post</h1>
            <form onSubmit={handleSubmit} name='create-post' className="flex flex-col gap-4 mb-6 flex-1">
                <Upload type="image" setProgress={setProgress} setData={setCover} getToken={getToken}>
                    <button className='w-max p-2 shadow-medium rounded-xl text-sm text-gray-500 bg-white'>
                        Upload Cover Image
                    </button>
                </Upload>
                {cover && (
                    <img src={cover} alt="Cover" className="w-3/6 max-h-64 object-cover rounded-xl mb-2" />
                )}

                <input
                    placeholder="My awesome story" className="text-4xl font-semibold bg-transparent outline-none"
                    name="title" />
                <div className="flex items-center gap-4">
                    <label htmlFor="" className="text-sm ">Choose a category</label>
                    <select name="category" id="" className="rounded-xl bg-white shadow-md p-2">
                        <option value="general">General</option>
                        <option value="web design">Web design</option>
                        <option value="development">Development</option>
                        <option value="database">Database</option>
                        <option value="search">search engine</option>
                        <option value="marketing">Marketing</option>
                    </select>
                </div>
                <textarea className="p-4 rounded-xl bg-white shadow-md" name="desc" placeholder="Tell your story..."></textarea>
                <div className='flex flex-1 '>
                    <div className='flex flex-col gap-2 '>
                        {/* Upload components for image and video */}
                        <Upload type="image" setProgress={setProgress} setData={setImg} getToken={getToken}>
                            <div className='cursor-pointer'>📷</div>
                        </Upload>
                        <Upload type="video" setProgress={setProgress} setData={setVideo} getToken={getToken}>
                            <div className='cursor-pointer'>▶ </div>
                        </Upload>
                    </div>
                    {/* ReactQuill editor for rich text editing */}
                    {/* This will allow users to write and format their content */}
                        <ReactQuill 
                            theme="snow" 
                            className=" flex-1 rounded-xl bg-white shadow-md"
                            value={value}
                            onChange={setValue}
                        />
                </div>
                <button
                    className="w-max p-2 shadow-medium rounded-xl text-sm text-white bg-blue-500 hover:bg-blue-700 active:bg-blue-300 disabled:bg-blue-100 cursor:not-allowed"
                    disabled={mutation.isPending || (0 > progress && progress < 100)}>
                    {mutation.isPending ? 'Publishing...' : 'Publish'}
                </button>
                <div className="mt-4">
                    {"Progress: " + progress + "%"}
                    {mutation.isError && (
                        <span className="text-red-500"> {mutation.error.message}</span>
                    )}
                </div>
            </form>
        </div>
    );
    
};

export default Write;