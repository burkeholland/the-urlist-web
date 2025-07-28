import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps {
  children?: ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  type?: 'button' | 'submit';
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
}

export function Button({ 
  children, 
  onClick, 
  variant = 'default',
  size = 'default',
  type = 'button',
  disabled = false,
  isLoading = false,
  className
}: ButtonProps) {
  const baseClasses = `
    inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium 
    transition-colors focus-visible:outline-none focus-visible:ring-2 
    focus-visible:ring-teal-600 focus-visible:ring-offset-2 disabled:pointer-events-none 
    disabled:opacity-50 relative
  `;

  const variantClasses = {
    default: `
      bg-teal-600 text-white hover:bg-teal-700
      shadow-sm hover:shadow-md transition-all duration-200
    `,
    secondary: `
      bg-gray-100 text-gray-900 hover:bg-gray-200
      border border-gray-200 hover:border-gray-300
    `,
    destructive: `
      bg-red-500 text-white hover:bg-red-600
      shadow-sm hover:shadow-md
    `,
    outline: `
      border border-gray-200 bg-white hover:bg-gray-100 hover:text-gray-900
      hover:border-teal-500
    `,
    ghost: `
      hover:bg-gray-100 hover:text-gray-900
    `,
    link: `
      text-teal-600 underline-offset-4 hover:underline
    `
  };

  const sizeClasses = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      <span className={cn(
        "flex items-center gap-2 transition-opacity duration-200",
        isLoading ? 'opacity-0' : 'opacity-100'
      )}>
        {children}
      </span>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg 
            className="animate-spin h-4 w-4 text-current" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      )}
    </button>
  );
}