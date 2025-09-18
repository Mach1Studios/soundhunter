import React from 'react';
import { View, Text } from 'react-native';

interface SectionTitleProps {
  label: string;
  className?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ label, className = '' }) => {
  return (
    <View className={`flex-row items-center gap-3 mb-4 ${className}`}>
      <View className="h-[1px] flex-1 bg-neutral-300" />
      <Text className="text-xs tracking-widest uppercase text-neutral-500 font-mono">
        {label}
      </Text>
      <View className="h-[1px] flex-1 bg-neutral-300" />
    </View>
  );
};

export default SectionTitle;

