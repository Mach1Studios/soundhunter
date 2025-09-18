import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { platformSelect } from '../../utils/platform';

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
  const inputHeight = platformSelect({
    web: 'h-10',
    native: 'h-12',
    default: 'h-10'
  });

  return (
    <View className={`relative w-full ${className}`}>
      <View className="absolute inset-y-0 left-0 pl-3 flex items-center justify-center pointer-events-none z-10">
        <MagnifyingGlassIcon className="h-5 w-5 text-neutral-400" />
      </View>
      <TextInput
        className={`w-full ${inputHeight} rounded-lg border border-neutral-300 bg-neutral-50 pl-10 pr-4 text-neutral-900 text-sm placeholder:text-neutral-400 focus:border-neutral-500 focus:bg-white`}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        returnKeyType="search"
        placeholderTextColor="#a3a3a3"
      />
    </View>
  );
};

export default SearchBar;