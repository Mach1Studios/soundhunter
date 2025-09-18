import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { platformSelect } from '../../utils/platform';

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
    sm: 'px-3 py-2 text-xs',
    md: 'px-4 py-3 text-sm',
    lg: 'px-6 py-4 text-base'
  };

  const variantClasses = {
    primary: 'bg-neutral-900 border-neutral-900 text-white',
    secondary: 'bg-neutral-100 border-neutral-300 text-neutral-900',
    outline: 'bg-transparent border-neutral-300 text-neutral-900',
    ghost: 'bg-transparent border-transparent text-neutral-900'
  };

  const disabledClasses = disabled || loading 
    ? 'opacity-50' 
    : 'active:opacity-80';

  const height = platformSelect({
    web: size === 'sm' ? 'h-8' : size === 'md' ? 'h-10' : 'h-12',
    native: size === 'sm' ? 'h-10' : size === 'md' ? 'h-12' : 'h-14',
    default: 'h-10'
  });

  return (
    <TouchableOpacity
      className={`
        ${height} 
        ${sizeClasses[size]} 
        ${variantClasses[variant]} 
        ${disabledClasses}
        border rounded-md flex-row items-center justify-center font-medium
        ${className}
      `}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' ? '#ffffff' : '#404040'} 
        />
      ) : (
        <Text className={`
          font-medium text-center
          ${variant === 'primary' ? 'text-white' : 'text-neutral-900'}
          ${size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'}
        `}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;