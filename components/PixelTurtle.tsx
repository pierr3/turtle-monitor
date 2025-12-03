import React from 'react';

export const PixelTurtle: React.FC<{ className?: string, size?: number }> = ({ className = "", size = 48 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges" // Crucial for 8-bit look
    >
      <path d="
        M7 6h4v1H7V6zm
        4 1h4v1h-4V7zm
        -6 2h2v2H5V9zm
        12 0h2v2h-2V9zm
        -8 1h6v4H9v-4zm
        -3 3h2v2H6v-2zm
        12 0h2v2h-2v-2zm
        -4 4h1v2h-1v-2zm
        -6 0h1v2H9v-2zm
        -4-1h2v1H5v-1zm
        14 0h2v1h-2v-1z
        M8 5h2v1H8V5zm
        4 5h1v1h-1v-1zm
        -2 1h1v1h-1v-1zm
        2 1h1v1h-1v-1z
      " />
    </svg>
  );
};
