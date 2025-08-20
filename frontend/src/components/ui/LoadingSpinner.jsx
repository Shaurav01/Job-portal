import React from "react";

const LoadingSpinner = ({ size = "8", color = "blue-600", className = "" }) => {
  return (
    <div
      className={`flex items-center justify-center ${className}`}
      role="status"
      aria-label="Loading"
    >
      <div
        className={`animate-spin rounded-full h-${size} w-${size} border-2 border-gray-200 border-t-${color}`}
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;
