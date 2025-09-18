import React from 'react';

interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'px-3 py-2 text-xs h-8',
    md: 'px-4 py-3 text-sm h-10',
    lg: 'px-6 py-4 text-base h-12'
  };

  const variantClasses = {
    primary: 'bg-neutral-900 border-neutral-900 text-white hover:bg-neutral-800',
    secondary: 'bg-neutral-100 border-neutral-300 text-neutral-900 hover:bg-neutral-200',
    outline: 'bg-transparent border-neutral-300 text-neutral-900 hover:bg-neutral-50',
    ghost: 'bg-transparent border-transparent text-neutral-900 hover:bg-neutral-100'
  };

  const disabledClasses = disabled || loading 
    ? 'opacity-50 cursor-not-allowed' 
    : 'cursor-pointer active:opacity-80';

  return (
    <button
      className={`
        ${sizeClasses[size]} 
        ${variantClasses[variant]} 
        ${disabledClasses}
        border rounded-md flex items-center justify-center font-medium transition-all duration-200
        ${className}
      `}
      onClick={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
      ) : (
        title
      )}
    </button>
  );
};

export default Button;