import React, { useState } from 'react';
import { View, Text, ScrollView, FlatList } from 'react-native';
import { platformSelect } from '../utils/platform';
import SearchBar from '../components/shared/SearchBar';
import Chip from '../components/shared/Chip';
import SoundCard from '../components/shared/SoundCard';
import MapPlaceholder from '../components/shared/MapPlaceholder';
import { Sound } from '../types';

const SearchScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  
  const filterOptions = [
    'Location', 'Time', 'Conditions', 'Tags', 
    'Duration', 'Channels', 'License'
  ];

  // Mock data for demonstration
  const mockSounds: Sound[] = Array.from({ length: 8 }, (_, i) => ({
    id: `sound-${i}`,
    title: `Sound Recording ${i + 1}`,
    description: `A beautiful sound from nature`,
    duration: 30 + Math.random() * 120,
    location: {
      lat: 35.6762 + Math.random() * 0.1,
      lng: 139.6503 + Math.random() * 0.1,
      name: `Location ${i + 1}`
    },
    tags: ['nature', 'ambient'],
    category: 'biophony' as const,
    uploadedAt: new Date(),
    uploadedBy: 'user123',
    license: 'CC BY 4.0',
    audioUrl: '',
    channels: 2,
    sampleRate: 44100
  }));

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const isWeb = platformSelect({
    web: true,
    native: false,
    default: false
  });

  if (isWeb) {
    return (
      <View className="flex-1 bg-white">
        <View className="max-w-7xl mx-auto px-4 py-6">
          <View className="grid grid-cols-12 gap-4 h-full">
            {/* Filters Sidebar */}
            <View className="col-span-3 border border-neutral-300 rounded-lg p-3 space-y-3">
              <Text className="text-xs uppercase tracking-wider text-neutral-500">
                Filters
              </Text>
              {filterOptions.map((filter) => (
                <View key={filter}>
                  <Text className="text-xs text-neutral-600 mb-1">{filter}</Text>
                  <View className="h-9 border border-neutral-300 rounded bg-white" />
                </View>
              ))}
            </View>

            {/* Results List */}
            <View className="col-span-5 space-y-3">
              <SearchBar
                placeholder="Query: rain AND (forest) near:Kyoto"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <ScrollView className="flex-1">
                <View className="space-y-2">
                  {mockSounds.map((sound) => (
                    <SoundCard
                      key={sound.id}
                      sound={sound}
                      variant="list"
                    />
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Map */}
            <View className="col-span-4">
              <MapPlaceholder height={520} />
              <View className="mt-3 h-10 border border-neutral-300 rounded flex-row items-center justify-between px-3">
                <Text className="text-xs text-neutral-600">Time Scrubber</Text>
                <Text className="text-xs text-neutral-600">Now</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }

  // Mobile Layout
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-4 space-y-4">
        <SearchBar
          placeholder="Search or build a query"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2">
            {filterOptions.map((filter) => (
              <Chip
                key={filter}
                label={filter}
                selected={selectedFilters.includes(filter)}
                onPress={() => toggleFilter(filter)}
              />
            ))}
          </View>
        </ScrollView>

        <View className="space-y-2">
          {mockSounds.map((sound) => (
            <SoundCard
              key={sound.id}
              sound={sound}
              variant="list"
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default SearchScreen;