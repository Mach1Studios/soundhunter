import React from 'react';
import { View, Text } from 'react-native';
import MapPlaceholder from '../components/shared/MapPlaceholder';
import Button from '../components/shared/Button';
import { platformSelect } from '../utils/platform';

const MapScreen: React.FC = () => {
  const isWeb = platformSelect({
    web: true,
    native: false,
    default: false
  });

  return (
    <View className="flex-1 bg-white">
      <View className="p-4 space-y-3">
        <MapPlaceholder height={isWeb ? 600 : 520} />
        
        <View className="flex-row items-center gap-2">
          <View className="flex-1 h-9 border border-neutral-300 rounded bg-white" />
          <Button title="🎯" variant="outline" size="sm" className="w-9" />
          <Button title="⚙️" variant="outline" size="sm" className="w-9" />
        </View>
        
        <View className="h-10 border border-neutral-300 rounded flex-row items-center justify-between px-3">
          <Text className="text-xs text-neutral-600">Time</Text>
          <Text className="text-xs text-neutral-600">Scrub</Text>
        </View>
      </View>
    </View>
  );
};

export default MapScreen;