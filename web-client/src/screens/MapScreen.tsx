import React, { useEffect, useState } from 'react';
import InteractiveMap, { SoundRecording } from '../components/shared/InteractiveMap';
import TimeRangeSlider from '../components/shared/TimeRangeSlider';

interface TimezoneOption {
  value: string; // Displayed zone code such as UTC+02:00
  iana: string;  // IANA identifier for calculations
  examples: string;
}

const TIMEZONE_OPTIONS: TimezoneOption[] = [
  { value: 'UTC', iana: 'Etc/UTC', examples: 'Reykjavík, Accra' },
  { value: 'UTC-10:00', iana: 'Pacific/Honolulu', examples: 'Honolulu' },
  { value: 'UTC-08:00', iana: 'America/Los_Angeles', examples: 'Los Angeles, Vancouver' },
  { value: 'UTC-07:00', iana: 'America/Denver', examples: 'Denver, Calgary' },
  { value: 'UTC-06:00', iana: 'America/Chicago', examples: 'Chicago, Mexico City' },
  { value: 'UTC-05:00', iana: 'America/New_York', examples: 'New York, Toronto' },
  { value: 'UTC-03:00', iana: 'America/Sao_Paulo', examples: 'São Paulo, Rio' },
  { value: 'GMT/BST', iana: 'Europe/London', examples: 'London, Dublin' },
  { value: 'UTC+01:00', iana: 'Europe/Paris', examples: 'Paris, Berlin' },
  { value: 'UTC+02:00', iana: 'Africa/Johannesburg', examples: 'Johannesburg, Cape Town' },
  { value: 'UTC+04:00', iana: 'Asia/Dubai', examples: 'Dubai, Abu Dhabi' },
  { value: 'UTC+05:30', iana: 'Asia/Kolkata', examples: 'Delhi, Mumbai' },
  { value: 'UTC+08:00', iana: 'Asia/Shanghai', examples: 'Shanghai, Beijing' },
  { value: 'UTC+09:00', iana: 'Asia/Tokyo', examples: 'Tokyo, Osaka' },
  { value: 'UTC+10:00', iana: 'Australia/Sydney', examples: 'Sydney, Melbourne' },
];

const formatTimezoneLabel = (option: TimezoneOption) => `${option.value} (${option.examples})`;

const MapScreen: React.FC = () => {
  const [startTime, setStartTime] = useState<string>('11:00'); // Default start time (on 5-min interval)
  const [endTime, setEndTime] = useState<string>('13:00'); // Default end time (2-hour span, on 5-min interval)
  const [selectedTimezone, setSelectedTimezone] = useState<TimezoneOption>(TIMEZONE_OPTIONS[0]);
  const [showDayNight, setShowDayNight] = useState<boolean>(true);
  
  // Load Leaflet CSS
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    link.crossOrigin = '';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const handleMarkerClick = (recording: SoundRecording) => {
    console.log('Marker clicked:', recording);
    // TODO: Navigate to sound detail screen or open modal
  };

  const handleTimeRangeChange = (newStartTime: string, newEndTime: string) => {
    setStartTime(newStartTime);
    setEndTime(newEndTime);
  };

  return (
    <div className="flex-1 bg-white relative" style={{ zIndex: 1 }}>
      <div className="p-6 space-y-6">
        {/* Enhanced Map Container */}
        <div 
          className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden relative"
          style={{ 
            zIndex: 1,
            // Create isolated stacking context to contain map z-index values
            isolation: 'isolate'
          }}
        >
          <InteractiveMap 
            height={600} 
            onMarkerClick={handleMarkerClick}
            startTime={startTime}
            endTime={endTime}
            timezone={selectedTimezone.iana}
            showDayNight={showDayNight}
          />
        </div>
        
        {/* Controls Section */}
        <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 rounded-xl p-5 border border-neutral-200">
          <div className="flex flex-row items-center gap-3 mb-5">
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-neutral-700 mb-1">Filter Controls</h3>
              <p className="text-xs text-neutral-500">Adjust time range and search parameters</p>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="timezone-select" className="text-xs text-neutral-500 whitespace-nowrap">Timezone</label>
              <select
                id="timezone-select"
                className="text-sm border border-neutral-300 rounded-lg px-3 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={selectedTimezone.value}
                onChange={(event) => {
                  const next = TIMEZONE_OPTIONS.find(option => option.value === event.target.value);
                  if (next) {
                    setSelectedTimezone(next);
                  }
                }}
              >
                {TIMEZONE_OPTIONS.map((option) => {
                  return (
                    <option key={option.value} value={option.value}>
                      {formatTimezoneLabel(option)}
                    </option>
                  );
                })}
              </select>
            </div>
            <button className="w-10 h-10 border border-neutral-300 rounded-lg bg-white hover:bg-neutral-50 flex items-center justify-center text-sm shadow-sm transition-colors"
              onClick={() => setShowDayNight(prev => !prev)}
              aria-pressed={showDayNight}
              title={showDayNight ? 'Hide day/night shading' : 'Show day/night shading'}
            >
              {showDayNight ? '🌗' : '☀️'}
            </button>
            <button className="w-10 h-10 border border-neutral-300 rounded-lg bg-white hover:bg-neutral-50 flex items-center justify-center text-sm shadow-sm transition-colors">
              ⚙️
            </button>
          </div>
          
          {/* Enhanced Time Range Slider */}
          <TimeRangeSlider
            startTime={startTime}
            endTime={endTime}
            onTimeRangeChange={handleTimeRangeChange}
            className="bg-white rounded-lg p-4 border border-neutral-200 shadow-sm"
            timezoneLabel={formatTimezoneLabel(selectedTimezone)}
          />
          <div className="mt-3 text-xs text-neutral-500 flex items-center gap-2">
            <span className="font-medium">Day/Night overlay:</span>
            <span>{showDayNight ? 'On' : 'Off'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapScreen;
