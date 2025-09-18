import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import SoundCard from '../components/SoundCard';

const LibraryScreen: React.FC = () => {
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-4 space-y-4">
        {/* Header */}
        <View className="flex-row justify-between items-center">
          <Text className="text-sm font-medium text-neutral-900">Collections</Text>
          <TouchableOpacity className="h-8 w-20 border border-neutral-300 rounded flex-row items-center justify-center">
            <Text className="text-xs text-neutral-600">New</Text>
          </TouchableOpacity>
        </View>

        {/* Collections Grid */}
        <View className="grid grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SoundCard
              key={i}
              title={`Collection ${i + 1}`}
              location="5 sounds"
              variant="grid"
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default LibraryScreen;

