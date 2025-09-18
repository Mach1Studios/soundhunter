import React from 'react';
import { View } from 'react-native';
import Svg, { Line } from 'react-native-svg';

interface WaveformProps {
  height?: number;
  width?: number;
  className?: string;
}

const Waveform: React.FC<WaveformProps> = ({ 
  height = 96, 
  width = 600, 
  className = '' 
}) => {
  // Generate sample waveform data
  const waveformData = Array.from({ length: 120 }, (_, i) => 
    (Math.sin(i / 4) * 0.5 + 0.5) * (height * 0.9)
  );

  return (
    <View className={`w-full border border-neutral-300 rounded-lg overflow-hidden bg-white ${className}`}>
      <Svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height}>
        {waveformData.map((amplitude, i) => {
          const x = (i / waveformData.length) * width;
          const h = amplitude;
          return (
            <Line
              key={i}
              x1={x}
              x2={x}
              y1={(height - h) / 2}
              y2={(height + h) / 2}
              stroke="#9CA3AF"
              strokeWidth={1}
            />
          );
        })}
      </Svg>
    </View>
  );
};

export default Waveform;

