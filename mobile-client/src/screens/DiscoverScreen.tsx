import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import SearchBar from '../components/SearchBar';
import SectionTitle from '../components/SectionTitle';
import Chip from '../components/Chip';
import WorldMapCTA from '../components/WorldMapCTA';
import SoundHunterLogo from '../components/SoundHunterLogo';

const DiscoverScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = ['Biophony', 'Geophony', 'Anthropophony'];

  const toggleCategory = (category: string) => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-4 space-y-4">
        {/* Header */}
        <View className="flex-row items-center gap-3">
          <View className="w-7 h-7 rounded border border-sage-300 bg-gradient-to-br from-sage-600 to-primary-700 items-center justify-center">
            <SoundHunterLogo size={20} color="#ffffff" />
          </View>
          <Text className="text-sm font-medium text-primary-800">Soundhunter</Text>
        </View>

        {/* Search Bar */}
        <SearchBar
          placeholder="Search sounds, places, tags"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {/* Categories */}
        <SectionTitle label="Explore by Category" />
        
        <View className="flex-row flex-wrap gap-2 justify-center">
          {categories.map((category) => (
            <Chip
              key={category}
              label={category}
              selected={selectedCategory === category}
              onPress={() => toggleCategory(category)}
            />
          ))}
        </View>

        {/* World Map CTA */}
        <WorldMapCTA height={180} />
      </View>
    </ScrollView>
  );
};

export default DiscoverScreen;

