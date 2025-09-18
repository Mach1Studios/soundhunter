import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MapPlaceholder from './MapPlaceholder';

interface WorldMapCTAProps {
  height?: number;
  onPress?: () => void;
  className?: string;
}

const WorldMapCTA: React.FC<WorldMapCTAProps> = ({ 
  height = 180, 
  onPress,
  className = '' 
}) => {
  return (
    <View className={`border border-neutral-300 rounded-lg p-3 ${className}`}>
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-xs text-neutral-500">Mini world view</Text>
        <Text className="text-[10px] text-neutral-400">Clusters preview</Text>
      </View>
      
      <MapPlaceholder height={height} />
      
      <View className="mt-2 h-6 border border-neutral-300 rounded flex-row items-center justify-center">
        <Text className="text-[10px] text-neutral-600">Time Scrubber</Text>
      </View>
      
      <TouchableOpacity 
        className="mt-3 h-10 border border-neutral-300 rounded flex-row items-center justify-center"
        onPress={onPress}
      >
        <Text className="text-xs text-neutral-600">Open World Map</Text>
      </TouchableOpacity>
    </View>
  );
};

export default WorldMapCTA;

