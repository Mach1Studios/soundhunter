import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { platformSelect } from '../utils/platform';
import SectionTitle from '../components/shared/SectionTitle';
import SearchBar from '../components/shared/SearchBar';
import Chip from '../components/shared/Chip';
import MapPlaceholder from '../components/shared/MapPlaceholder';
import Button from '../components/shared/Button';

const DiscoverScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = ['Biophony', 'Geophony', 'Anthropophony'];

  const isWeb = platformSelect({
    web: true,
    native: false,
    default: false
  });

  if (isWeb) {
    return (
      <ScrollView className="flex-1 bg-white">
        <View className="max-w-7xl mx-auto px-4 py-6">
          <View className="grid grid-cols-12 gap-4">
            {/* Main Content */}
            <View className="col-span-9 space-y-4">
              <SearchBar
                placeholder="Search sounds, places, tags"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              
              {/* World Map CTA */}
              <View className="border border-neutral-300 rounded-lg p-4">
                <View className="flex-row items-center justify-between mb-3">
                  <Text className="text-xs text-neutral-500 uppercase tracking-wider">
                    Mini world view
                  </Text>
                  <Text className="text-xs text-neutral-400">
                    Clusters preview
                  </Text>
                </View>
                <MapPlaceholder height={260} />
                <View className="mt-3 h-6 border border-neutral-300 rounded flex-row items-center justify-center">
                  <Text className="text-xs text-neutral-600">Time Scrubber</Text>
                </View>
                <Button
                  title="Open World Map"
                  variant="outline"
                  className="mt-3"
                />
              </View>
            </View>

            {/* Sidebar */}
            <View className="col-span-3 space-y-6">
              <View>
                <SectionTitle label="Categories" />
                <View className="space-y-2">
                  {categories.map((category) => (
                    <Chip
                      key={category}
                      label={category}
                      selected={selectedCategory === category}
                      onPress={() => setSelectedCategory(
                        selectedCategory === category ? null : category
                      )}
                      className="w-full"
                    />
                  ))}
                </View>
              </View>

              <View>
                <SectionTitle label="Quick Entry" />
                <View className="space-y-2">
                  <Button title="Upload" variant="outline" />
                  <Button title="Record" variant="outline" />
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }

  // Mobile Layout
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-4 space-y-4">
        <SearchBar
          placeholder="Search sounds, places, tags"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <SectionTitle label="Explore by Category" />
        
        <View className="flex-row flex-wrap gap-2 justify-center">
          {categories.map((category) => (
            <Chip
              key={category}
              label={category}
              selected={selectedCategory === category}
              onPress={() => setSelectedCategory(
                selectedCategory === category ? null : category
              )}
            />
          ))}
        </View>

        {/* World Map CTA */}
        <View className="border border-neutral-300 rounded-lg p-3">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-xs text-neutral-500">Mini world view</Text>
            <Text className="text-xs text-neutral-400">Clusters preview</Text>
          </View>
          <MapPlaceholder height={180} />
          <View className="mt-2 h-6 border border-neutral-300 rounded flex-row items-center justify-center">
            <Text className="text-xs text-neutral-600">Time Scrubber</Text>
          </View>
          <Button
            title="Open World Map"
            variant="outline"
            className="mt-3"
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default DiscoverScreen;