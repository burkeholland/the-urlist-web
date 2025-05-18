import type { ReactNode } from 'react';

interface ButtonProps {
  children?: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'destructive';
  type?: 'button' | 'submit';
  disabled?: boolean;
  isLoading?: boolean;
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  type = 'button',
  disabled = false,
  isLoading = false
}: ButtonProps) {
  const baseClasses = `
    relative px-6 py-3 rounded-xl font-medium 
    transition-all duration-300 ease-out transform
    disabled:opacity-50 disabled:cursor-not-allowed
    hover:-translate-y-0.5 active:translate-y-0
    focus:outline-none focus:ring-2 focus:ring-opacity-50
    flex items-center justify-center gap-2
  `;

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-[#15BFAE] to-[#13B0A0]
      hover:from-[#13B0A0] hover:to-[#03A678]
      text-white shadow-sm
      focus:ring-[#15BFAE]/50
      hover:shadow-lg hover:shadow-[#15BFAE]/20
      dark:from-[#15BFAE] dark:to-[#13B0A0] dark:hover:from-[#13B0A0] dark:hover:to-[#03A678]
    `,
    secondary: `
      bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700
      text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100
      border border-gray-200 dark:border-gray-700
      focus:ring-gray-300 dark:focus:ring-gray-600
      hover:border-gray-300 dark:hover:border-gray-600
    `,
    destructive: `
      bg-white dark:bg-gray-900 hover:bg-red-50 dark:hover:bg-red-900
      text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300
      border-2 border-red-200 dark:border-red-400 hover:border-red-300 dark:hover:border-red-500
      focus:ring-red-200 dark:focus:ring-red-700
      hover:shadow-lg hover:shadow-red-100 dark:hover:shadow-red-900
    `
  };

  const spinnerColor = variant === 'destructive' ? 'text-red-600 dark:text-red-400' :
    variant === 'secondary' ? 'text-gray-700 dark:text-gray-200' :
      'text-white';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      <span className={`flex items-center gap-2 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        {children}
      </span>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className={`animate-spin h-5 w-5 ${spinnerColor}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}
    </button>
  );
}