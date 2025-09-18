import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onSubmit?: () => void;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  placeholder = "Search sounds, places, tags", 
  value,
  onChangeText,
  onSubmit,
  className = ''
}) => {
  return (
    <div className={`relative w-full ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
        <MagnifyingGlassIcon className="h-5 w-5 text-neutral-400" />
      </div>
      <input
        type="text"
        className="w-full h-10 rounded-lg border border-neutral-300 bg-neutral-50 pl-10 pr-4 text-neutral-900 text-sm placeholder:text-neutral-400 focus:border-neutral-500 focus:bg-white focus:outline-none"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChangeText?.(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSubmit?.()}
      />
    </div>
  );
};

export default SearchBar;