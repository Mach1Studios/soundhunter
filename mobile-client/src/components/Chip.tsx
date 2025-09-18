import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

interface ChipProps {
  label: string;
  onPress?: () => void;
  selected?: boolean;
  className?: string;
}

const Chip: React.FC<ChipProps> = ({ 
  label, 
  onPress, 
  selected = false, 
  className = '' 
}) => {
  const baseClasses = "px-2 py-1 rounded-md border";
  const stateClasses = selected 
    ? "border-neutral-500 bg-neutral-100" 
    : "border-neutral-300 bg-white";

  return (
    <TouchableOpacity
      className={`${baseClasses} ${stateClasses} ${className}`}
      onPress={onPress}
      disabled={!onPress}
    >
      <Text className={`text-xs ${selected ? "text-neutral-900" : "text-neutral-600"}`}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default Chip;

