import { useState } from 'react';

interface ShareButtonProps {
  url: string;
}

export function ShareButton({ url }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className="group flex items-center gap-2 px-6 py-3 
          bg-gray-50 hover:bg-gray-100
          text-gray-700 font-medium rounded-xl
          transition-all duration-300 ease-out transform hover:-translate-y-0.5
          border border-gray-200
          focus:outline-none focus:ring-2 focus:ring-[#15BFAE]/50"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-5 w-5 transition-transform duration-300 ease-out text-[#15BFAE]
            ${isHovering ? 'scale-110 rotate-12' : ''}`} 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
        </svg>
        <span className="relative">
          Share List
          {isHovering && (
            <span className="absolute inset-x-0 -bottom-px h-px bg-[#15BFAE] animate-scale-in" />
          )}
        </span>
      </button>

      {copied && (
        <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 
          px-4 py-2 rounded-xl text-sm font-medium
          bg-white text-gray-700
          border border-gray-200 shadow-sm
          animate-scale-in"
        >
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#15BFAE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            Copied to clipboard!
          </div>
        </div>
      )}
    </div>
  );
}