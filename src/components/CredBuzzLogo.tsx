
import React from 'react';

interface CredBuzzLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const CredBuzzLogo: React.FC<CredBuzzLogoProps> = ({ className = "", size = "md" }) => {
  // Size mapping for the logo
  const sizeClasses = {
    sm: "h-8",
    md: "h-10",
    lg: "h-14"
  };

  return (
    <div className={`flex items-center ${className}`}>
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Professional credible logo design */}
        <svg 
          viewBox="0 0 80 80" 
          className={`${sizeClasses[size]}`}
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Structured gradient background */}
          <defs>
            <linearGradient id="professionalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#EA580C" />
            </linearGradient>
          </defs>
          
          {/* Solid background with subtle shadow */}
          <circle cx="40" cy="40" r="36" fill="url(#professionalGradient)" />
          <circle cx="40" cy="40" r="32" fill="url(#professionalGradient)" opacity="0.7" />
          
          {/* Shield outline for trust/security */}
          <path 
            d="M40 16L24 24V38C24 46.8 31.2 55.2 40 58C48.8 55.2 56 46.8 56 38V24L40 16Z" 
            stroke="white" 
            strokeWidth="2.5" 
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          
          {/* Simplified "CB" text inside shield */}
          <text
            x="40"
            y="44"
            fontFamily="Arial, sans-serif"
            fontSize="16"
            fontWeight="bold"
            fill="white"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            CB
          </text>
          
          {/* Checkmark has been removed */}
        </svg>
      </div>
      
      {/* Logo text */}
      <div className="ml-2 font-bold flex flex-col items-start">
        <span className="text-ai-dark text-2xl leading-tight font-bold tracking-tight">
          <span className="text-ai-orange">Cred</span>Buzz
        </span>
      </div>
    </div>
  );
};

export default CredBuzzLogo;
