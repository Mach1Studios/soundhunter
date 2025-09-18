import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import Waveform from '../components/Waveform';
import SectionTitle from '../components/SectionTitle';
import SoundCard from '../components/SoundCard';

const SoundDetailScreen: React.FC = () => {
  const [viewMode, setViewMode] = useState<'waveform' | 'spectrogram'>('waveform');

  const metadataItems = [
    { label: 'Location', value: 'Olympic National Forest, WA' },
    { label: 'Date/Time', value: 'Jan 15, 2024' },
    { label: 'Conditions', value: 'Clear, 12°C, Light breeze' },
    { label: 'License', value: 'CC BY 4.0' },
  ];

  const tags = ['forest', 'dawn', 'birds', 'ambient'];

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <View className="p-4 space-y-4">
          {/* Title */}
          <View className="h-6 w-48 bg-neutral-200 rounded" />

          {/* Waveform */}
          <Waveform height={96} />

          {/* View Toggle */}
          <View className="grid grid-cols-2 gap-2">
            <TouchableOpacity
              className={`h-8 border rounded flex-row items-center justify-center ${
                viewMode === 'waveform' 
                  ? 'border-neutral-500 bg-neutral-100' 
                  : 'border-neutral-300 bg-white'
              }`}
              onPress={() => setViewMode('waveform')}
            >
              <Text className="text-xs text-neutral-600">Waveform</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`h-8 border rounded flex-row items-center justify-center ${
                viewMode === 'spectrogram' 
                  ? 'border-neutral-500 bg-neutral-100' 
                  : 'border-neutral-300 bg-white'
              }`}
              onPress={() => setViewMode('spectrogram')}
            >
              <Text className="text-xs text-neutral-600">Spectrogram</Text>
            </TouchableOpacity>
          </View>

          {/* Metadata Grid */}
          <View className="grid grid-cols-2 gap-2">
            {metadataItems.map((item, index) => (
              <View key={index} className="border border-neutral-300 rounded p-2">
                <Text className="text-[11px] uppercase tracking-wider text-neutral-500 mb-1">
                  {item.label}
                </Text>
                <Text className="text-xs text-neutral-900">{item.value}</Text>
              </View>
            ))}
          </View>

          {/* Tags */}
          <View>
            <Text className="text-[11px] uppercase tracking-wider text-neutral-500 mb-2">
              Tags
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {tags.map((tag) => (
                <View key={tag} className="px-2 py-1 bg-neutral-100 rounded-md">
                  <Text className="text-xs text-neutral-700">{tag}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Related Sounds */}
          <SectionTitle label="Related" />
          <View className="grid grid-cols-3 gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <SoundCard
                key={i}
                title={`Related Sound ${i + 1}`}
                location="Location"
                variant="grid"
              />
            ))}
          </View>

          {/* Bottom padding for fixed player */}
          <View className="h-20" />
        </View>
      </ScrollView>

      {/* Fixed Player Bar */}
      <View className="absolute bottom-6 left-4 right-4">
        <View className="h-14 border border-neutral-300 rounded-xl bg-white/90 backdrop-blur flex-row items-center px-3 gap-3 shadow-lg">
          <View className="w-16 h-10 bg-neutral-50 border border-neutral-200 rounded" />
          <View className="flex-1">
            <Text className="text-sm font-medium text-neutral-900" numberOfLines={1}>
              Forest Ambience at Dawn
            </Text>
            <Text className="text-xs text-neutral-500" numberOfLines={1}>
              Olympic National Forest, WA
            </Text>
          </View>
          <TouchableOpacity className="w-10 h-10 border border-neutral-300 rounded flex-row items-center justify-center">
            <Text className="text-sm">▶️</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SoundDetailScreen;

