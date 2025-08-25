import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuth, useUser } from "@clerk/clerk-react";
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Upload from '../components/Upload';

const EditPost = () => {
    const { id } = useParams();
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
    const [slug, setSlug] = useState('');
    const quillRef = useRef(null);

    // Fetch post data by ID
    const { data: post, isLoading, error } = useQuery({
        queryKey: ['post', id],
        queryFn: async () => {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/posts/id/${id}`);
            return response.data;
        },
        enabled: !!id
    });

    // Populate form with post data
    useEffect(() => {
        if (post) {
            console.log('Post data loaded:', post);
            setTitle(post.title || '');
            setContent(post.content || '');
            setDesc(post.desc || '');
            setCategory(post.category || 'general');
            setCoverImage(post.coverImage || '');
            setImages(Array.isArray(post.images) ? post.images : []);
            setVideos(Array.isArray(post.videos) ? post.videos : []);
            setSlug(post.slug || '');
        }
    }, [post]);

    const mutation = useMutation({
        mutationFn: async (updatedPost) => {
            const token = await getToken();
            return axios.put(`${import.meta.env.VITE_API_URL}/posts/${id}`, updatedPost, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
        },
        onSuccess: (res) => {
            toast.success('Post updated successfully!');
            navigate(`/post/${res.data.post.slug}`);
        },
        onError: (error) => {
            console.error('Full error:', error);
            const serverMessage = error.response?.data?.message || 'Error updating post';
            const validationErrors = error.response?.data?.errors;
            
            toast.error(serverMessage);
            if (validationErrors) {
                Object.values(validationErrors).forEach(err => {
                    toast.error(err);
                });
            }
        }
    });

    // Handle image insertion
    useEffect(() => {
        if (images.length > 0 && quillRef.current) {
            const lastImage = images[images.length - 1];
            const editor = quillRef.current.getEditor();
            const range = editor.getSelection();
            
            if (range) {
                editor.insertEmbed(range.index, 'image', lastImage);
            } else {
                editor.insertEmbed(editor.getLength(), 'image', lastImage);
            }
        }
    }, [images]);

    // Handle video insertion
    useEffect(() => {
        if (videos.length > 0 && quillRef.current) {
            const lastVideo = videos[videos.length - 1];
            const editor = quillRef.current.getEditor();
            const range = editor.getSelection();
            
            if (range) {
                editor.insertEmbed(range.index, 'video', lastVideo);
            } else {
                editor.insertEmbed(editor.getLength(), 'video', lastVideo);
            }
        }
    }, [videos]);

    if (isLoading) {
        return <div className="text-gray-500 text-lg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">Loading post data...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-lg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">Error loading post: {error.message}</div>;
    }

    if (!isLoaded) {
        return <div className="text-gray-500 text-lg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">Loading...</div>;
    }

    if (isLoaded && !isSignedIn) {
        return <div className="text-center mt-10">You need to login to edit posts!</div>;
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
            
            console.log('Updating post with data:', postData);
            mutation.mutate(postData);
        } catch (err) {
            console.error('Submission error:', err);
            toast.error('Failed to update post');
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
        <div className="h-[calc(100vh-64px)] md:[calc(100vh-80px)] flex flex-col gap-4 p-4">
            <h1 className="text-2xl font-light">Edit Post</h1>
            
            {post ? (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-6 flex-1">
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">Slug: {slug}</span>
                    </div>

                    <Upload type="image" setProgress={setProgress} setData={setCoverImage} getToken={getToken}>
                        <button type="button" className='w-max p-2 shadow-medium rounded-xl text-sm text-gray-500 bg-white'>
                            {coverImage ? 'Change Cover Image' : 'Upload Cover Image'}
                        </button>
                    </Upload>
                    {coverImage && (
                        <img src={coverImage} alt="Cover" className="w-3/6 max-h-64 object-cover rounded-xl mb-2" />
                    )}

                    <input
                        placeholder="Post Title" 
                        className="text-4xl font-semibold bg-transparent outline-none border-b border-gray-200 pb-2"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    
                    <div className="flex items-center gap-4">
                        <label className="text-sm font-medium">Category:</label>
                        <select 
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="rounded-xl bg-white shadow-md p-2 border" 
                            required
                        >
                            <option value="general">General</option>
                            <option value="web design">Web design</option>
                            <option value="development">Development</option>
                            <option value="database">Database</option>
                            <option value="search">Search engine</option>
                            <option value="marketing">Marketing</option>
                        </select>
                    </div>
                    
                    <textarea 
                        className="p-4 rounded-xl bg-white shadow-md border" 
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        placeholder="Short description of your post..."
                        rows={3}
                    />
                    
                    <div className='flex flex-1 flex-col md:flex-row gap-4'>
                        <div className='flex flex-row md:flex-col gap-2'>
                            <Upload 
                                type="image" 
                                setProgress={setProgress} 
                                setData={(url) => setImages(prev => [...prev, url])} 
                                getToken={getToken}
                            >
                                <div className='cursor-pointer p-2 bg-white shadow-md rounded-lg'>📷 Add Image</div>
                            </Upload>
                            <Upload 
                                type="video" 
                                setProgress={setProgress} 
                                setData={(url) => setVideos(prev => [...prev, url])} 
                                getToken={getToken}
                            >
                                <div className='cursor-pointer p-2 bg-white shadow-md rounded-lg'>▶ Add Video</div>
                            </Upload>
                        </div>
                        
                        <div className='flex-1 flex flex-col'>
                            <label className="text-sm font-medium mb-2">Content:</label>
                            <ReactQuill 
                                ref={quillRef}
                                theme="snow" 
                                className="flex-1 rounded-xl bg-white shadow-md border"
                                value={content}
                                onChange={setContent}
                                modules={modules}
                                formats={formats}
                                placeholder="Write your post content here..."
                            />
                        </div>
                    </div>
                    
                    <div className="flex gap-4 mt-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="w-max p-2 shadow-medium rounded-xl text-sm text-gray-700 bg-gray-200 hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="w-max p-2 shadow-medium rounded-xl text-sm text-white bg-blue-500 hover:bg-blue-700 active:bg-blue-300 disabled:bg-blue-100 disabled:cursor-not-allowed"
                            disabled={mutation.isPending || (progress > 0 && progress < 100)}
                        >
                            {mutation.isPending ? 'Updating...' : 'Update Post'}
                        </button>
                    </div>
                    
                    {progress > 0 && progress < 100 && (
                        <div className="mt-4">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-blue-600 h-2.5 rounded-full" style={{width: `${progress}%`}}></div>
                            </div>
                            <span className="text-sm">Upload progress: {progress}%</span>
                        </div>
                    )}
                    
                    {mutation.isError && (
                        <div className="text-red-500 mt-2">Error: {mutation.error.message}</div>
                    )}
                </form>
            ) : (
                <div className="text-center py-10">Post not found</div>
            )}
        </div>
    );
};

export default EditPost;