import React from 'react';
import { View } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

interface SoundHunterLogoProps {
  size?: number;
  color?: string;
}

const SoundHunterLogo: React.FC<SoundHunterLogoProps> = ({ 
  size = 24, 
  color = '#ffffff' 
}) => {
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 1000 1000">
        <G>
          <G>
            <G>
              <Path 
                d="m379.34 860c-198.5 0-360-161.5-360-360h240c0 66.17 53.83 120 120 120 66.17 0 120-53.83 120-120h240c0 198.5-161.49 360-360 360z" 
                fill={color} 
              />
              <Path 
                d="m979.34 500h-240c0-66.17-53.83-120-120-120-66.17 0-120 53.83-120 120h-240c0-198.5 161.5-360 360-360 198.51 0 360 161.5 360 360z" 
                fill={color} 
              />
            </G>
          </G>
        </G>
      </Svg>
    </View>
  );
};

export default SoundHunterLogo;
