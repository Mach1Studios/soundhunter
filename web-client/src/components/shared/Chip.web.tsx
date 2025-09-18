import React from 'react';

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
  const baseClasses = "px-3 py-2 rounded-md border text-xs font-medium transition-colors duration-200";
  const stateClasses = selected 
    ? "border-neutral-500 bg-neutral-100 text-neutral-900" 
    : "border-neutral-300 bg-white text-neutral-600 hover:bg-neutral-50";

  const Element = onPress ? 'button' : 'div';

  return (
    <Element
      className={`${baseClasses} ${stateClasses} ${className} ${onPress ? 'cursor-pointer' : ''}`}
      onClick={onPress}
    >
      {label}
    </Element>
  );
};

export default Chip;