import React, { useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';

interface SoundRecording {
  id: string;
  lat: number;
  lng: number;
  title: string;
  description: string;
  recordedAt: string;
  recordedTime: string; // Time of day when recorded (HH:MM format)
  duration: number;
}

interface InteractiveMapProps {
  height?: number;
  className?: string;
  recordings?: SoundRecording[];
  onMarkerClick?: (recording: SoundRecording) => void;
  startTime?: string; // Start of time range (HH:MM format)
  endTime?: string; // End of time range (HH:MM format)
  timezone?: string;
  showDayNight?: boolean;
}

const MIDPOINT_ADJUSTMENT_MS = 24 * 60 * 60 * 1000;

// Dummy data for sound recordings
const dummyRecordings: SoundRecording[] = [
  {
    id: '1',
    lat: 40.7128,
    lng: -74.0060,
    title: 'NYC Street Ambience',
    description: 'Busy intersection in Manhattan',
    recordedAt: '2024-01-15',
    recordedTime: '14:30', // 2:30 PM - afternoon rush
    duration: 120
  },
  {
    id: '2',
    lat: 40.7589,
    lng: -73.9851,
    title: 'Central Park Birds',
    description: 'Morning bird songs in Central Park',
    recordedAt: '2024-01-14',
    recordedTime: '07:15', // 7:15 AM - early morning
    duration: 180
  },
  {
    id: '3',
    lat: 40.6892,
    lng: -74.0445,
    title: 'Brooklyn Bridge',
    description: 'Traffic and footsteps on the bridge',
    recordedAt: '2024-01-13',
    recordedTime: '08:45', // 8:45 AM - morning commute
    duration: 95
  },
  {
    id: '4',
    lat: 40.7505,
    lng: -73.9934,
    title: 'Times Square Chaos',
    description: 'The sounds of Times Square at night',
    recordedAt: '2024-01-12',
    recordedTime: '22:20', // 10:20 PM - nighttime
    duration: 150
  },
  {
    id: '5',
    lat: 40.7614,
    lng: -73.9776,
    title: 'Museum Mile',
    description: 'Quiet street near the Metropolitan Museum',
    recordedAt: '2024-01-11',
    recordedTime: '11:45', // 11:45 AM - late morning
    duration: 200
  },
  {
    id: '6',
    lat: 40.7282,
    lng: -73.7949,
    title: 'Queens Market',
    description: 'Bustling market sounds',
    recordedAt: '2024-01-10',
    recordedTime: '16:00', // 4:00 PM - afternoon
    duration: 160
  },
  {
    id: '7',
    lat: 40.7831,
    lng: -73.9712,
    title: 'Upper West Side',
    description: 'Residential street sounds',
    recordedAt: '2024-01-09',
    recordedTime: '19:30', // 7:30 PM - evening
    duration: 140
  },
  {
    id: '8',
    lat: 40.7260,
    lng: -74.0050,
    title: 'Battery Park',
    description: 'Harbor sounds and seagulls',
    recordedAt: '2024-01-08',
    recordedTime: '06:45', // 6:45 AM - dawn
    duration: 185
  }
];

// Helper function to convert time string to minutes since midnight
const timeToMinutes = (timeString: string): number => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
};

// Helper function to check if a recording should be visible based on time range
const isRecordingVisible = (recording: SoundRecording, startTime?: string, endTime?: string): boolean => {
  if (!startTime || !endTime) return true; // Show all if no filter
  
  const recordingMinutes = timeToMinutes(recording.recordedTime);
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);

  if (startMinutes === endMinutes) {
    return true;
  }

  // Handle day wrap-around (e.g., time range crosses midnight)
  if (startMinutes > endMinutes) {
    return recordingMinutes >= startMinutes || recordingMinutes <= endMinutes;
  }

  return recordingMinutes >= startMinutes && recordingMinutes <= endMinutes;
};

const getDateForTimeRange = (startTime?: string, endTime?: string, timezone?: string): Date | null => {
  if (!startTime || !endTime || !timezone) {
    return null;
  }

  const now = new Date();
  const zonedNow = utcToZonedTime(now, timezone);
  const datePart = format(zonedNow, 'yyyy-MM-dd');

  const toUtcDate = (time: string) => {
    const isoLike = `${datePart}T${time}:00`;
    return zonedTimeToUtc(isoLike, timezone);
  };

  try {
    const startDateUtc = toUtcDate(startTime);
    let endDateUtc = toUtcDate(endTime);

    if (startTime === endTime) {
      return startDateUtc;
    }

    if (endDateUtc <= startDateUtc) {
      endDateUtc = new Date(endDateUtc.getTime() + MIDPOINT_ADJUSTMENT_MS);
    }

    const midPointUtc = new Date(startDateUtc.getTime() + (endDateUtc.getTime() - startDateUtc.getTime()) / 2);
    return midPointUtc;
  } catch (error) {
    console.warn('Failed to interpret timezone', error);
    return null;
  }
};

const InteractiveMap: React.FC<InteractiveMapProps> = ({ 
  height = 520, 
  className = '', 
  recordings = dummyRecordings, 
  onMarkerClick,
  startTime,
  endTime,
  timezone = 'UTC',
  showDayNight = true
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const terminatorLayerRef = useRef<any>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const markersRef = useRef<Map<string, any>>(new Map());

  // Filter recordings based on time range
  const visibleRecordings = recordings.filter(recording => 
    isRecordingVisible(recording, startTime, endTime)
  );

  useEffect(() => {
    const initializeMap = async () => {
      try {
        // Dynamic import to avoid SSR issues
        const L = (await import('leaflet')).default;

        if (typeof window !== 'undefined') {
          (window as any).L = L;
        }
        
        // Fix for default markers in react-leaflet
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });

        if (mapRef.current && !mapInstanceRef.current) {
          // Initialize map centered on NYC
          const map = L.map(mapRef.current).setView([40.7128, -74.0060], 12);

          // Add tile layer
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 18,
          }).addTo(map);

          mapInstanceRef.current = map;
          setMapLoaded(true);
        }
      } catch (error) {
        console.error('Map initialization failed:', error);
        setMapError(`Failed to load map: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };

    // Initialize map only once
    if (!mapInstanceRef.current && mapRef.current) {
      setTimeout(initializeMap, 100);
    }
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) {
      return;
    }

    if (!showDayNight) {
      if (terminatorLayerRef.current) {
        map.removeLayer(terminatorLayerRef.current);
        terminatorLayerRef.current = null;
      }
      return;
    }

    const ensureLayer = () => {
      if (terminatorLayerRef.current) {
        return terminatorLayerRef.current;
      }
      const terminatorFactory = require('leaflet-terminator');
      const date = getDateForTimeRange(startTime, endTime, timezone) ?? new Date();
      const layer = terminatorFactory(date);
      layer.addTo(map);
      terminatorLayerRef.current = layer;
      return layer;
    };

    const layer = ensureLayer();
    const date = getDateForTimeRange(startTime, endTime, timezone);
    if (layer && date) {
      layer.setDate(date);
      if (typeof layer.redraw === 'function') {
        layer.redraw();
      }
    }

    return () => {
      if (terminatorLayerRef.current && !showDayNight) {
        map.removeLayer(terminatorLayerRef.current);
        terminatorLayerRef.current = null;
      }
    };
  }, [showDayNight, startTime, endTime, timezone]);

  useEffect(() => {
    return () => {
      if (terminatorLayerRef.current && mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(terminatorLayerRef.current);
        terminatorLayerRef.current = null;
      }
    };
  }, []);

  // Update markers when recordings or time filter changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const L = require('leaflet');

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstanceRef.current.removeLayer(marker);
    });
    markersRef.current.clear();

    // Add visible markers
    visibleRecordings.forEach((recording) => {
      const marker = L.marker([recording.lat, recording.lng]).addTo(mapInstanceRef.current);
      
      const popupContent = `
        <div style="min-width: 220px;">
          <h3 style="margin: 0 0 8px 0; font-weight: 600; font-size: 14px;">${recording.title}</h3>
          <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">${recording.description}</p>
          <div style="font-size: 11px; color: #888;">
            <div>Recorded: ${recording.recordedAt} at ${recording.recordedTime}</div>
            <div>Duration: ${recording.duration}s</div>
          </div>
        </div>
      `;
      
      marker.bindPopup(popupContent);
      
      marker.on('click', () => {
        if (onMarkerClick) {
          onMarkerClick(recording);
        }
      });

      markersRef.current.set(recording.id, marker);
    });
  }, [visibleRecordings, onMarkerClick]);

  if (mapError) {
    return (
      <div 
        className={`w-full rounded-lg border border-red-300 bg-red-50 ${className}`}
        style={{ height }}
      >
        <div className="flex items-center justify-center h-full text-red-600 text-center p-4">
          <div>
            <div className="font-semibold">Map Error</div>
            <div className="text-sm mt-1">{mapError}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`w-full rounded-lg border border-neutral-300 overflow-hidden relative ${className}`}
      style={{ 
        height,
        zIndex: 1 // Ensure map container stays below header (z-50)
      }}
    >
      {!mapLoaded && !mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-50 z-10">
          <div className="text-center text-neutral-600">
            <div className="animate-spin text-2xl mb-2">🗺️</div>
            <div className="text-sm">Loading map...</div>
          </div>
        </div>
      )}
      <div
        ref={mapRef}
        className="leaflet-container-constrained"
        style={{ 
          width: '100%', 
          height: '100%',
          borderRadius: '0.5rem',
          position: 'relative',
          zIndex: 1 // Keep map content within container bounds
        }}
      />
      
      {/* CSS to constrain Leaflet z-index values and prevent overflow */}
      <style jsx>{`
        :global(.leaflet-container-constrained) {
          overflow: hidden !important;
          contain: layout style paint !important;
        }
        :global(.leaflet-container-constrained .leaflet-control-container *) {
          z-index: 10 !important;
        }
        :global(.leaflet-container-constrained .leaflet-popup-pane *) {
          z-index: 20 !important;
        }
        :global(.leaflet-container-constrained .leaflet-tooltip-pane *) {
          z-index: 15 !important;
        }
        :global(.leaflet-container-constrained .leaflet-shadow-pane *) {
          z-index: 5 !important;
        }
        :global(.leaflet-container-constrained .leaflet-marker-pane *) {
          z-index: 8 !important;
        }
        :global(.leaflet-container-constrained .leaflet-overlay-pane *) {
          z-index: 6 !important;
        }
      `}</style>
    </div>
  );
};

export default InteractiveMap;
export type { SoundRecording };
