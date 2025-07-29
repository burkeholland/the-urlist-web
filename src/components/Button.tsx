import type { ReactNode } from 'react';

interface ButtonProps {
  children?: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit';
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
}

export function Button({ 
  children, 
  onClick, 
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  isLoading = false,
  className = ''
}: ButtonProps) {
  const baseClasses = `
    relative inline-flex items-center justify-center gap-2 font-medium 
    transition-all duration-200 ease-out
    disabled:cursor-not-allowed disabled:opacity-50
    focus:outline-none focus:ring-2 focus:ring-offset-2
    transform hover:scale-105 active:scale-95
  `;

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm rounded-lg',
    md: 'px-4 py-2.5 text-sm rounded-lg',
    lg: 'px-6 py-3 text-base rounded-xl'
  };

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-[#15BFAE] to-[#03A678]
      hover:from-[#03A678] hover:to-[#15BFAE]
      text-white shadow-sm
      focus:ring-[#15BFAE]/50
      hover:shadow-lg hover:shadow-[#15BFAE]/25
    `,
    secondary: `
      bg-white hover:bg-gray-50
      text-gray-700 hover:text-gray-900
      border border-gray-300 hover:border-gray-400
      focus:ring-gray-300
      shadow-sm hover:shadow
    `,
    destructive: `
      bg-gradient-to-r from-red-500 to-red-600
      hover:from-red-600 hover:to-red-700
      text-white shadow-sm
      focus:ring-red-500/50
      hover:shadow-lg hover:shadow-red-500/25
    `,
    ghost: `
      bg-transparent hover:bg-gray-100
      text-gray-700 hover:text-gray-900
      focus:ring-gray-300
    `,
    outline: `
      bg-transparent hover:bg-[#15BFAE]/5
      text-[#15BFAE] hover:text-[#03A678]
      border border-[#15BFAE]/30 hover:border-[#15BFAE]
      focus:ring-[#15BFAE]/50
    `
  };

  const spinnerColor = variant === 'destructive' ? 'text-white' : 
                      variant === 'primary' ? 'text-white' :
                      'text-gray-700';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      <span className={`flex items-center gap-2 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        {children}
      </span>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className={`animate-spin h-4 w-4 ${spinnerColor}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}
    </button>
  );
}