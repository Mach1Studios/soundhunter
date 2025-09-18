import React from 'react';

interface SoundHunterLogoProps {
  className?: string;
}

const SoundHunterLogo: React.FC<SoundHunterLogoProps> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 1000 1000" fill="currentColor">
    <g>
      <g>
        <g>
          <path d="m379.34 860c-198.5 0-360-161.5-360-360h240c0 66.17 53.83 120 120 120 66.17 0 120-53.83 120-120h240c0 198.5-161.49 360-360 360z"/>
          <path d="m979.34 500h-240c0-66.17-53.83-120-120-120-66.17 0-120 53.83-120 120h-240c0-198.5 161.5-360 360-360 198.51 0 360 161.5 360 360z"/>
        </g>
      </g>
    </g>
  </svg>
);

export default SoundHunterLogo;
