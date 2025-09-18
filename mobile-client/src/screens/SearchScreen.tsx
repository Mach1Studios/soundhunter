import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import SearchBar from '../components/SearchBar';
import Chip from '../components/Chip';
import SoundCard from '../components/SoundCard';

const SearchScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  
  const filterOptions = [
    'Location', 'Time', 'Conditions', 'Tags', 
    'Duration', 'Channels', 'License'
  ];

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  // Mock data for demonstration
  const mockSounds = Array.from({ length: 6 }, (_, i) => ({
    id: `sound-${i}`,
    title: `Sound Recording ${i + 1}`,
    location: `Location ${i + 1}`,
  }));

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-4 space-y-4">
        {/* Search Bar */}
        <SearchBar
          placeholder="Search or build a query"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        
        {/* Filter Chips */}
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

        {/* Results List */}
        <View className="space-y-2">
          {mockSounds.map((sound) => (
            <SoundCard
              key={sound.id}
              title={sound.title}
              location={sound.location}
              variant="list"
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default SearchScreen;

