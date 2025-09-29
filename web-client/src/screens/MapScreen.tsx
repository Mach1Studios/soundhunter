import React, { useEffect, useState } from 'react';
import InteractiveMap, { SoundRecording } from '../components/shared/InteractiveMap';
import TimeRangeSlider from '../components/shared/TimeRangeSlider';

const MapScreen: React.FC = () => {
  const [startTime, setStartTime] = useState<string>('11:00'); // Default start time (on 5-min interval)
  const [endTime, setEndTime] = useState<string>('13:00'); // Default end time (2-hour span, on 5-min interval)
  
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
          />
        </div>
        
        {/* Controls Section */}
        <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 rounded-xl p-5 border border-neutral-200">
          <div className="flex flex-row items-center gap-3 mb-5">
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-neutral-700 mb-1">Filter Controls</h3>
              <p className="text-xs text-neutral-500">Adjust time range and search parameters</p>
            </div>
            <button className="w-10 h-10 border border-neutral-300 rounded-lg bg-white hover:bg-neutral-50 flex items-center justify-center text-sm shadow-sm transition-colors">
              🎯
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
          />
        </div>
      </div>
    </div>
  );
};

export default MapScreen;
