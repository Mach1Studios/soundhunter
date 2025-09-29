'use client';

import MapScreen from '../../src/screens/MapScreen';

export default function MapPage() {
  return (
    <div className="min-h-screen bg-neutral-100 relative" style={{ zIndex: 0 }}>
      <div className="max-w-7xl mx-auto px-4 py-6 relative" style={{ zIndex: 1 }}>
        <h1 className="text-2xl font-semibold text-neutral-900 mb-6">Map Explorer</h1>
        <div 
          className="bg-white rounded-lg border border-neutral-300 overflow-hidden relative"
          style={{ 
            zIndex: 1,
            // Additional isolation to ensure no map elements escape
            isolation: 'isolate'
          }}
        >
          <MapScreen />
        </div>
      </div>
    </div>
  );
}