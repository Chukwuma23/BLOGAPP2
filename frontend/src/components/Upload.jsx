import React, { useRef } from "react";
import { IKContext, IKUpload } from "imagekitio-react";
import { toast } from "react-toastify";


// Function to get authorization for file uploads
    // This will be used to get the upload signature and token for ImageKit
    
const Upload = ({ children, type, setProgress, setData, getToken }) => {
    // authenticator function now has access to getToken prop
    const authenticator = async () => {
        try {
            // Fetch the authentication parameters from your backend
            // Ensure your backend endpoint is set up to return the required parameters
            const response = await fetch(`${import.meta.env.VITE_API_URL}/posts/upload-auth`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${await getToken()}`
                }
            });
            
            // Check if the response is ok (status code 200-299)
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error: ${response.status} - ${errorText}`);
            }
            
            const data = await response.json();
            // Ensure your backend returns signature, expire, and token
            return {
                signature: data.signature,
                expire: data.expire,
                token: data.token
            };
        } catch (error) {
            console.error('Authentication error:', error);
            throw error;
        }
    };
    const ref = useRef(null);

     // Function to handle image upload errors and success
    // This will be used to show notifications for image upload status
    const onError = (error) => {
        console.error(error);
        toast.error('Error uploading image: ' + error.message);
    };

    // Function to handle successful image upload
    const onSuccess = (res) => {
        console.log('Image uploaded successfully:', res);
        toast.success('Image uploaded successfully!');
        // Always pass the image URL to setData
        if (res && res.url) {
            setData(res.url);
        } else {
            setData(res);
        }
    };



    // Function to handle upload progress
    const onUploadProgress = (progressEvent) => {
    const { loaded, total } = progressEvent;
    if (total > 0) {
        const percentCompleted = Math.round((loaded / total) * 100);
        setProgress(percentCompleted);
    }
};
    return (
       
             <IKContext
                publicKey={import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY}
                authenticator={authenticator}
                urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}
                >
                    {/* IKUpload component handles the file upload to ImageKit */}
                <IKUpload
                    useUniqueFileName
                    onSuccess={onSuccess}
                    onError={onError}
                    onUploadProgress={onUploadProgress}
                    className="hidden"
                    ref={ref}
                    accept={`${type}/*`}
                />
            {/* This is the upload button that triggers the file input */}
                <div className="flex gap-2" onClick={() => ref.current.click()}>
                    {children}
                </div>
                </IKContext>
           
        
    )
}
export default Upload;