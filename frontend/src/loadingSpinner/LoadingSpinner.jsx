import React from 'react';

const LoadingSpinner = ({ 
  type = 'spinner', 
  size = 'medium', 
  color = 'blue', 
  text = '', 
  fullScreen = false 
}) => {
  // Color classes
  const colorClasses = {
    blue: 'bg-blue-600',
    red: 'bg-red-600',
    green: 'bg-green-600',
    purple: 'bg-purple-600',
    indigo: 'bg-indigo-600',
    pink: 'bg-pink-600',
    yellow: 'bg-yellow-600',
    gray: 'bg-gray-600'
  };

  // Size classes
  const sizeClasses = {
    small: { 
      spinner: 'w-6 h-6 border-3',
      dot: 'w-3 h-3',
      container: 'h-16',
      text: 'text-sm'
    },
    medium: { 
      spinner: 'w-10 h-10 border-4',
      dot: 'w-4 h-4',
      container: 'h-24',
      text: 'text-base'
    },
    large: { 
      spinner: 'w-16 h-16 border-4',
      dot: 'w-5 h-5',
      container: 'h-32',
      text: 'text-lg'
    }
  };

  // Render based on type
  const renderLoader = () => {
    switch (type) {
      case 'dots':
        return (
          <div className="flex space-x-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`${colorClasses[color]} rounded-full animate-bounce ${sizeClasses[size].dot}`}
                style={{ animationDelay: `${i * 0.1}s` }}
              ></div>
            ))}
          </div>
        );
      
      case 'pulse':
        return (
          <div className={`${colorClasses[color]} rounded-lg animate-pulse ${sizeClasses[size].spinner}`}></div>
        );
      
      case 'progress':
        return (
          <div className="w-48 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`${colorClasses[color]} h-2 rounded-full animate-progress`}
              style={{ width: "45%" }}
            ></div>
          </div>
        );
      
      case 'spinner':
      default:
        return (
          <div className={`border-4 ${colorClasses[color]} border-t-transparent rounded-full animate-spin ${sizeClasses[size].spinner}`}></div>
        );
    }
  };

  const containerClasses = fullScreen 
    ? "fixed inset-0 flex flex-col items-center justify-center bg-white bg-opacity-90 z-50"
    : "flex flex-col items-center justify-center p-6";

  return (
    <div className={containerClasses}>
      <div className={`flex items-center justify-center ${sizeClasses[size].container}`}>
        {renderLoader()}
      </div>
      {text && (
        <p className={`mt-4 text-gray-600 font-medium ${sizeClasses[size].text}`}>
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;