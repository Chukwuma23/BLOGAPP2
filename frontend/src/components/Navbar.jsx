


import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Prevent body scrolling when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'static';
      document.body.style.width = 'auto';
    }
    
    // Cleanup function
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'static';
      document.body.style.width = 'auto';
    };
  }, [isOpen]);

  return (
    <>
      {/* Navbar */}
      <nav className="w-full h-16 md:h-20 flex items-center justify-between bg-transperent shadow-md px-4 md:px-8 absolute
      top-0 z-10  right-0">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3 text-xl md:text-2xl font-bold text-blue-800">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-800 rounded-md flex items-center justify-center text-white font-bold">
            C
          </div>
          <span>ChuksTech Blog</span>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          <Link to="/" className="text-gray-700 hover:text-blue-800 transition-colors">Home</Link>
          <Link to="/posts?sort=trending" className="text-gray-700 hover:text-blue-800 transition-colors">Trending</Link>
          <Link to="/posts?sort=popular" className="text-gray-700 hover:text-blue-800 transition-colors">Most Popular</Link>
          <Link to="/about" className="text-gray-700 hover:text-blue-800 transition-colors">About</Link>
          
          <div className="flex items-center gap-4">
            <SignedOut>
              <Link to="/login" className="bg-blue-800 rounded-full text-white py-2 px-4 text-sm hover:bg-blue-900 transition-colors">
                Login
              </Link>
              <Link to="/register" className="border border-blue-800 text-blue-800 rounded-full py-2 px-4 text-sm hover:bg-blue-50 transition-colors">
                Sign Up
              </Link>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
              <Link to="/write" className="bg-blue-800 rounded-full text-white py-2 px-4 text-sm hover:bg-blue-900 transition-colors">
                Write
              </Link>
            </SignedIn>
          </div>
        </div>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="text-3xl text-gray-700 focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Sidebar Overlay */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Sidebar */}
      <div 
        className={`fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white shadow-xl z-40 transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-xl font-bold text-blue-800">Menu</h2>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-2xl text-gray-500 hover:text-gray-700"
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>
          
          <div className="flex flex-col gap-6 flex-grow">
            <Link 
              to="/" 
              className="text-lg font-medium text-gray-800 hover:text-blue-800 py-2 border-b border-gray-100"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/posts?sort=trending" 
              className="text-lg font-medium text-gray-800 hover:text-blue-800 py-2 border-b border-gray-100"
              onClick={() => setIsOpen(false)}
            >
              Trending
            </Link>
            <Link 
              to="/posts?sort=popular" 
              className="text-lg font-medium text-gray-800 hover:text-blue-800 py-2 border-b border-gray-100"
              onClick={() => setIsOpen(false)}
            >
              Most Popular
            </Link>
            <Link 
              to="/about" 
              className="text-lg font-medium text-gray-800 hover:text-blue-800 py-2 border-b border-gray-100"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
          </div>
          
          <div className="mt-auto pt-6 border-t border-gray-200">
            <div className="flex flex-col gap-4">
              <SignedOut>
                <Link 
                  to="/login" 
                  className="bg-blue-800 rounded-full text-white py-3 px-4 hover:bg-blue-900 transition-colors w-full text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="border border-blue-800 text-blue-800 rounded-full py-3 px-4 hover:bg-blue-50 transition-colors w-full text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </SignedOut>
              <SignedIn>
                <Link 
                  to="/write" 
                  className="bg-blue-800 rounded-full text-white py-3 px-4 hover:bg-blue-900
                   transition-colors w-full text-center md:hidden"
                  onClick={() => setIsOpen(false)}
                >
                  Write a Post
                </Link>
                <div className="flex justify-center">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </SignedIn>
            </div>
          </div>
        </div>
      </div>

      {/* Page Content - shifts when sidebar is open */}
      <div className={`pt-16 md:pt-20 px-4 md:px-8 transition-transform duration-300 ${
        isOpen ? 'md:transform-none transform -translate-x-1/4' : ''
      }`}>
        {/* This is where your page content will be rendered */}
      </div>
    </>
  );
};

export default Navbar;