import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MapPlaceholder from '../components/MapPlaceholder';

const MapScreen: React.FC = () => {
  return (
    <View className="flex-1 bg-white p-4">
      <View className="space-y-3">
        {/* Full Screen Map */}
        <MapPlaceholder height={520} />
        
        {/* Controls Row */}
        <View className="flex-row items-center gap-2">
          <View className="flex-1 h-9 border border-neutral-300 rounded bg-white" />
          <TouchableOpacity className="w-9 h-9 border border-neutral-300 rounded bg-white flex-row items-center justify-center">
            <Text className="text-xs">🎯</Text>
          </TouchableOpacity>
          <TouchableOpacity className="w-9 h-9 border border-neutral-300 rounded bg-white flex-row items-center justify-center">
            <Text className="text-xs">⚙️</Text>
          </TouchableOpacity>
        </View>
        
        {/* Time Scrubber */}
        <View className="h-10 border border-neutral-300 rounded flex-row items-center justify-between px-3">
          <Text className="text-xs text-neutral-600">Time</Text>
          <Text className="text-xs text-neutral-600">Scrub</Text>
        </View>
      </View>
    </View>
  );
};

export default MapScreen;

