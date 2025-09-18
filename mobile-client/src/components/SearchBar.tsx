import React from 'react';
import { View, TextInput } from 'react-native';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  placeholder = "Search sounds, places, tags", 
  value,
  onChangeText,
  className = ''
}) => {
  return (
    <View className={`w-full ${className}`}>
      <TextInput
        className="w-full h-10 rounded-lg border border-neutral-300 bg-neutral-50 px-3 text-neutral-900 text-sm"
        placeholder={placeholder}
        placeholderTextColor="#a3a3a3"
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

export default SearchBar;

