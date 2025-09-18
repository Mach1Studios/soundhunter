import React from 'react';
import { View } from 'react-native';

interface MapPlaceholderProps {
  height?: number;
  className?: string;
  showClusters?: boolean;
}

const MapPlaceholder: React.FC<MapPlaceholderProps> = ({ 
  height = 280, 
  className = '',
  showClusters = true 
}) => {
  return (
    <View 
      className={`w-full rounded-lg border border-neutral-300 bg-neutral-50 relative overflow-hidden ${className}`}
      style={{ height }}
    >
      {/* Grid pattern background */}
      <View 
        className="absolute inset-0 opacity-40"
        style={{
          backgroundColor: 'transparent',
        }}
      />
      
      {/* Cluster dots */}
      {showClusters && Array.from({ length: 14 }).map((_, i) => (
        <View
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
    </View>
  );
};

export default MapPlaceholder;

