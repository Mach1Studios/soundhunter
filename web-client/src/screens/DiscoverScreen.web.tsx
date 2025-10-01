'use client'

import React, { useState } from 'react';
import SectionTitle from '../components/shared/SectionTitle.web';
import SearchBar from '../components/shared/SearchBar.web';
import Chip from '../components/shared/Chip.web';
import Button from '../components/shared/Button.web';
import InteractiveMap from '../components/shared/InteractiveMap';
import TimeRangeSlider from '../components/shared/TimeRangeSlider';

const DiscoverScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [miniStartTime, setMiniStartTime] = useState<string>('08:00');
  const [miniEndTime, setMiniEndTime] = useState<string>('12:00');

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
              <InteractiveMap
                height={260}
                className="mb-4"
                startTime={miniStartTime}
                endTime={miniEndTime}
                timezone="Etc/UTC"
                showDayNight
                center={[20, 0]}
                zoom={2}
                hideControls
                recordings={[]}
              />
              <div className="border border-neutral-200 rounded-lg p-3 bg-neutral-50/60">
                <TimeRangeSlider
                  startTime={miniStartTime}
                  endTime={miniEndTime}
                  onTimeRangeChange={(start, end) => {
                    setMiniStartTime(start);
                    setMiniEndTime(end);
                  }}
                  timezoneLabel="UTC"
                  condensed
                />
              </div>
              <Button
                title="Open World Map"
                variant="outline"
                className="mt-3 w-full"
                onPress={() => {
                  // TODO: navigate to full map view
                }}
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