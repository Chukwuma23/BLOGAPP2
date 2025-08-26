import React, { useState, useEffect } from 'react';

const NetworkStatus = ({
  onlineMessage = "You're back online!",
  offlineMessage = "You are currently offline",
  position = "bottom",
  showRefreshButton = true
}) => {
  const [isOnline, setIsOnline] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setIsVisible(true);
      setTimeout(() => setIsVisible(false), 5000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setIsVisible(true);
    };
     // Set up event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    setIsOnline(navigator.onLine);
    if (!navigator.onLine) {
      setIsVisible(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };
   const positionClass = position === "top" ? "top-4" : "bottom-4";

  return (
    <div className={`fixed left-1/2 transform -translate-x-1/2 ${positionClass}
     z-50 transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
      <div className={`px-6 py-4 rounded-lg shadow-lg max-w-md ${isOnline ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
        <div className="flex items-center justify-between">
          <div className="">
            <span className="text-xl mr-3">
              {isOnline ? '✅' : '❌'}
            </span>
            <div className='flex flex-col'>
               {!isOnline && (
                <svg 
                  className="text-yellow-400 relative left-20 -top-10" 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="40"
                  height="40"
                  viewBox="0 0 20 20" 
                  fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58
                 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 
                 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd" />
              </svg>
               )}
              <p className="font-semibold">
                {isOnline ? onlineMessage : offlineMessage}
                 </p>
              {!isOnline && (
                <div>
                   
                <p className="flex text-sm mt-1 opacity-90">
                  Please check your internet connection or try again later.
                </p>
              </div>
              )}
            </div>
          </div>
          {!isOnline && showRefreshButton && (
            <button 
              onClick={handleRefresh}
              className="ml-4 px-3 py-1 bg-white bg-opacity-20 hover:bg-opacity-30 rounded text-sm font-medium transition-colors"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default NetworkStatus;