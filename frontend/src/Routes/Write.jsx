import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { useAuth, useUser } from "@clerk/clerk-react";
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Upload from '../components/Upload';

const Write = () => {
    const { isLoaded, isSignedIn } = useUser();
    const [content, setContent] = useState('');
    const { getToken } = useAuth();
    const navigate = useNavigate();
    const [coverImage, setCoverImage] = useState('');
    const [images, setImages] = useState([]);
    const [videos, setVideos] = useState([]);
    const [progress, setProgress] = useState(0);
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('general');
    const [desc, setDesc] = useState('');

    // Handle image insertion
    useEffect(() => {
        if (images.length > 0) {
            const lastImage = images[images.length - 1];
            setContent(prev => `${prev}<p><img src="${lastImage}" alt="Image" width="200" height="300" /></p>`);
        }
    }, [images]);

    // Handle video insertion
    useEffect(() => {
        if (videos.length > 0) {
            const lastVideo = videos[videos.length - 1];
            setContent(prev => `${prev}<p><iframe class="ql-video" src="${lastVideo}" alt="Video" width="200" height="300" controls /></p>`);
        }
    }, [videos]);

    const mutation = useMutation({
        mutationFn: async (newPost) => {
            const token = await getToken();
            return axios.post(`${import.meta.env.VITE_API_URL}/posts`, newPost, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
        },
        onSuccess: (res) => {
            toast.success('Post created successfully!');
           // navigate(`/${res.data.slug}`);
        },
        onError: (error) => {
            console.error('Full error:', error);
            const serverMessage = error.response?.data?.message || 'Error creating post';
            const validationErrors = error.response?.data?.errors;
            
            toast.error(serverMessage);
            if (validationErrors) {
                Object.values(validationErrors).forEach(err => {
                    toast.error(err);
                });
            }
        }
    });

    if (!isLoaded) {
        return <div className="text-gray-500 text-lg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">Loading...</div>;
    }

    if (isLoaded && !isSignedIn) {
        return <div className="">You should login!</div>;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate content
        const strippedContent = content.replace(/<[^>]*>?/gm, '').trim();
        if (!strippedContent) {
            toast.error('Post content cannot be empty');
            return;
        }

        if (!title.trim()) {
            toast.error('Title is required');
            return;
        }

        try {
            const postData = {
                title: title.trim(),
                category: category,
                desc: desc.trim(),
                content: content,
                coverImage: coverImage,
                images: images,
                videos: videos
            };
            
            console.log('Submitting post:', {
                ...postData,
                contentPreview: content.length > 50 ? content.substring(0, 50) + '...' : content
            });
            
            mutation.mutate(postData);
        } catch (err) {
            console.error('Submission error:', err);
            toast.error('Failed to submit post');
        }
    };

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{'list': 'ordered'}, {'list': 'bullet'}],
            ['link', 'image', 'video'],
            ['clean']
        ],
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet',
        'link', 'image', 'video'
    ];

    return (
        <div className="h-[calc(100vh-64px)] md:[calc(100vh-80px)] flex flex-col gap-4">
            <h1 className="text-cl font-light">Create a post</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-6 flex-1">
                <Upload type="image" setProgress={setProgress} setData={setCoverImage} getToken={getToken}>
                    <button type="button" className='w-max p-2 shadow-medium rounded-xl text-sm text-gray-500 bg-white'>
                        Upload Cover Image
                    </button>
                </Upload>
                {coverImage && (
                    <img src={coverImage} alt="Cover" className="w-3/6 max-h-64 object-cover rounded-xl mb-2" />
                )}

                <input
                    placeholder="My awesome story" 
                    className="text-4xl font-semibold bg-transparent outline-none"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                
                <div className="flex items-center gap-4">
                    <label className="text-sm">Choose a category</label>
                    <select 
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="rounded-xl bg-white shadow-md p-2" 
                        required
                    >
                        <option value="general">General</option>
                        <option value="web design">Web design</option>
                        <option value="development">Development</option>
                        <option value="health">Health</option>
                        <option value="sports">Sports</option>
                        <option value="marketing">Marketing</option>
                    </select>
                </div>
                
                <textarea 
                    className="p-4 rounded-xl bg-white shadow-md" 
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder="Tell your story..."
                />
                
                <div className='flex flex-1'>
                    <div className='flex flex-col gap-2'>
                        <Upload 
                            type="image" 
                            setProgress={setProgress} 
                            setData={(url) => setImages(prev => [...prev, url])} 
                            getToken={getToken}
                        >
                            <div className='cursor-pointer'>📷</div>
                        </Upload>
                        <Upload 
                            type="video" 
                            setProgress={setProgress} 
                            setData={(url) => setVideos(prev => [...prev, url])} 
                            getToken={getToken}
                        >
                            <div className='cursor-pointer'>▶</div>
                        </Upload>
                    </div>
                    
                    <ReactQuill 
                        theme="snow" 
                        className="flex-1 rounded-xl bg-white shadow-md"
                        value={content}
                        onChange={setContent}
                        modules={modules}
                        formats={formats}
                        placeholder="Write your post content here..."
                    />
                </div>
                
                <button
                    type="submit"
                    className="w-max p-2 shadow-medium rounded-xl text-sm text-white bg-blue-500 hover:bg-blue-700 active:bg-blue-300 disabled:bg-blue-100 disabled:cursor-not-allowed"
                    disabled={mutation.isPending || (progress > 0 && progress < 100)}
                >
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