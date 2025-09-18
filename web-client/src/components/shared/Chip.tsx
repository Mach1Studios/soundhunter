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
  const baseClasses = "px-3 py-2 rounded-md border text-xs font-medium";
  const stateClasses = selected 
    ? "border-neutral-500 bg-neutral-100 text-neutral-900" 
    : "border-neutral-300 bg-white text-neutral-600";

  return (
    <TouchableOpacity
      className={`${baseClasses} ${stateClasses} ${className}`}
      onPress={onPress}
      disabled={!onPress}
    >
      <Text className={selected ? "text-neutral-900" : "text-neutral-600"}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default Chip;