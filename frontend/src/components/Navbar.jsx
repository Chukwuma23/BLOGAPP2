import { useState, useEffect } from "react";
import { Image } from '@imagekit/react';
import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, useAuth, UserButton } from '@clerk/clerk-react';


const Navbar = () => {
    const [open, setOpen] = useState(false);

    const {getToken} = useAuth();
    
    useEffect(() => {
        getToken()
            .then((token) => {
                console.log(token);
            });
    }, []);

    return (
        <div className="w-full h-16 md:h-20 flex items-center justify-between">
            {/* LOGO */}
            <Link to="/" className="flex items-center gap-4 text-2xl font-bold">
                <Image 
                    urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}
                    src='/logo.png'
                    className="w-8 h-8" 
                    alt="logo" 
                />
                <span>lamalogo</span>
            </Link>
            
            {/* MOBILE MENU */}
            <div className="md:hidden">
                <div 
                    className="cursor-pointer text-4xl" 
                    onClick={() => setOpen((prev) => !prev)}
                >
                    {open ? "x" : "="}
                </div>
                
                {/* MOBILE LINK LIST */}
                <div 
                    className={`w-full h-screen flex flex-col items-center justify-center absolute top-16  transition-all  ease-in-out gap-8 font-medium text-lg 
                    ${open ? "-right-0" : "-right-[100%]"}`}
                >
                   
                   <Link to="/">Home</Link>
                   <Link to="/">Trending</Link>
                  <Link to="/">Most popular</Link>
                  <Link to="/">About</Link>
                
                <a href="login">
                      <button className="bg-blue-800 rounded-3xl text-white py-2 px-4">Login</button>
                    </a>
                </div>
            </div>
            
            {/* DESKTOP MENU */}
            <div className="hidden md:flex items-center gap-8 xl:gap-12">
                
                  <Link to="/">Home</Link>
                   <Link to="/">Trending</Link>
                  <Link to="/">Most popular</Link>
                  <Link to="/">About</Link>
                
                <SignedOut>
        <Link to="/login">
                    <button className="bg-blue-800 rounded-3xl text-white py-2 px-4">Login</button>
                </Link>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
            </div>
        </div>
    );
};

export default Navbar;


