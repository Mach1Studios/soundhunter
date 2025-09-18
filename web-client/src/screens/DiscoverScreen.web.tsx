'use client'

import React, { useState } from 'react';
import SectionTitle from '../components/shared/SectionTitle.web';
import SearchBar from '../components/shared/SearchBar.web';
import Chip from '../components/shared/Chip.web';
import Button from '../components/shared/Button.web';

const DiscoverScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = ['Biophony', 'Geophony', 'Anthropophony'];

  return (
    <div className="flex-1 bg-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-4">
          {/* Main Content */}
          <div className="col-span-9 space-y-4">
            <SearchBar
              placeholder="Search sounds, places, tags"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            
            {/* World Map CTA */}
            <div className="border border-neutral-300 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-neutral-500 uppercase tracking-wider">
                  Mini world view
                </span>
                <span className="text-xs text-neutral-400">
                  Clusters preview
                </span>
              </div>
              <div className="w-full h-64 rounded-lg border border-neutral-300 bg-neutral-50 relative overflow-hidden wireframe-grid">
                {/* Cluster dots */}
                {Array.from({ length: 14 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute rounded-full border border-neutral-400/60 bg-white/80"
                    style={{
                      width: 24 + (i % 3) * 12,
                      height: 24 + (i % 3) * 12,
                      left: `${(i * 7) % 90}%`,
                      top: `${(i * 13) % 70}%`,
                    }}
                  />
                ))}
              </div>
              <div className="mt-3 h-6 border border-neutral-300 rounded flex items-center justify-center">
                <span className="text-xs text-neutral-600">Time Scrubber</span>
              </div>
              <Button
                title="Open World Map"
                variant="outline"
                className="mt-3 w-full"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-span-3 space-y-6">
            <div>
              <SectionTitle label="Categories" />
              <div className="space-y-2">
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
              </div>
            </div>

            <div>
              <SectionTitle label="Quick Entry" />
              <div className="space-y-2">
                <Button title="Upload" variant="outline" className="w-full" />
                <Button title="Record" variant="outline" className="w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscoverScreen;