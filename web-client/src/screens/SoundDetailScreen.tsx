import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import Waveform from '../components/shared/Waveform';
import Button from '../components/shared/Button';
import SoundCard from '../components/shared/SoundCard';
import SectionTitle from '../components/shared/SectionTitle';
import { Sound } from '../types';

interface SoundDetailScreenProps {
  sound?: Sound;
}

const SoundDetailScreen: React.FC<SoundDetailScreenProps> = ({ sound }) => {
  const [viewMode, setViewMode] = useState<'waveform' | 'spectrogram'>('waveform');

  // Mock data if no sound provided
  const mockSound: Sound = sound || {
    id: 'sound-1',
    title: 'Forest Ambience at Dawn',
    description: 'Recorded in the Pacific Northwest during early morning hours',
    duration: 180,
    location: {
      lat: 47.6062,
      lng: -122.3321,
      name: 'Olympic National Forest, WA'
    },
    tags: ['forest', 'dawn', 'birds', 'ambient'],
    category: 'biophony',
    uploadedAt: new Date('2024-01-15'),
    uploadedBy: 'naturalist_joe',
    license: 'CC BY 4.0',
    audioUrl: '',
    channels: 2,
    sampleRate: 48000
  };

  const metadataItems = [
    { label: 'Location', value: mockSound.location.name },
    { label: 'Date/Time', value: mockSound.uploadedAt.toLocaleDateString() },
    { label: 'Conditions', value: 'Clear, 12°C, Light breeze' },
    { label: 'License', value: mockSound.license },
  ];

  // Mock related sounds
  const relatedSounds = Array.from({ length: 3 }, (_, i) => ({
    ...mockSound,
    id: `related-${i}`,
    title: `Related Sound ${i + 1}`
  }));

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-4 space-y-4">
        {/* Title */}
        <Text className="text-lg font-semibold text-neutral-900">
          {mockSound.title}
        </Text>

        {/* Waveform */}
        <Waveform height={96} />

        {/* View Toggle */}
        <View className="flex-row gap-2">
          <Button
            title="Waveform"
            variant={viewMode === 'waveform' ? 'primary' : 'outline'}
            size="sm"
            onPress={() => setViewMode('waveform')}
            className="flex-1"
          />
          <Button
            title="Spectrogram"
            variant={viewMode === 'spectrogram' ? 'primary' : 'outline'}
            size="sm"
            onPress={() => setViewMode('spectrogram')}
            className="flex-1"
          />
        </View>

        {/* Metadata */}
        <View className="grid grid-cols-2 gap-2">
          {metadataItems.map((item, index) => (
            <View key={index} className="border border-neutral-300 rounded p-3">
              <Text className="text-xs text-neutral-500 uppercase tracking-wider mb-1">
                {item.label}
              </Text>
              <Text className="text-sm text-neutral-900">{item.value}</Text>
            </View>
          ))}
        </View>

        {/* Tags */}
        <View>
          <Text className="text-xs text-neutral-500 uppercase tracking-wider mb-2">
            Tags
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {mockSound.tags.map((tag) => (
              <View key={tag} className="px-2 py-1 bg-neutral-100 rounded-md">
                <Text className="text-xs text-neutral-700">{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Related Sounds */}
        <SectionTitle label="Related" />
        <View className="grid grid-cols-3 gap-3">
          {relatedSounds.map((relatedSound) => (
            <SoundCard
              key={relatedSound.id}
              sound={relatedSound}
              variant="grid"
            />
          ))}
        </View>
      </View>

      {/* Fixed Player Bar */}
      <View className="absolute bottom-6 left-4 right-4">
        <View className="h-14 border border-neutral-300 rounded-xl bg-white/90 backdrop-blur flex-row items-center px-3 gap-3 shadow-lg">
          <View className="w-16 h-10 bg-neutral-50 border border-neutral-200 rounded overflow-hidden">
            <Waveform height={40} />
          </View>
          <View className="flex-1">
            <Text className="text-sm font-medium text-neutral-900" numberOfLines={1}>
              {mockSound.title}
            </Text>
            <Text className="text-xs text-neutral-500" numberOfLines={1}>
              {mockSound.location.name}
            </Text>
          </View>
          <Button title="▶️" variant="outline" size="sm" className="w-10" />
        </View>
      </View>
    </ScrollView>
  );
};

export default SoundDetailScreen;