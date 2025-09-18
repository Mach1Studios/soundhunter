import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Sound } from '../../types';
import Waveform from './Waveform';

interface SoundCardProps {
  sound?: Sound;
  onPress?: () => void;
  variant?: 'grid' | 'list';
  className?: string;
  placeholder?: boolean;
}

const SoundCard: React.FC<SoundCardProps> = ({
  sound,
  onPress,
  variant = 'grid',
  className = '',
  placeholder = false
}) => {
  if (placeholder || !sound) {
    return (
      <View className={`border border-neutral-300 rounded-lg p-3 ${className}`}>
        <View className="h-20 bg-neutral-50 border border-neutral-200 rounded mb-2" />
        <View className="h-3 bg-neutral-200 rounded w-3/4 mb-1" />
        <View className="h-2 bg-neutral-100 rounded w-1/2" />
      </View>
    );
  }

  if (variant === 'list') {
    return (
      <TouchableOpacity
        className={`border border-neutral-300 rounded-lg p-3 flex-row items-center gap-3 ${className}`}
        onPress={onPress}
      >
        <View className="w-16 h-10 bg-neutral-50 border border-neutral-200 rounded overflow-hidden">
          <Waveform height={40} />
        </View>
        <View className="flex-1">
          <Text className="text-sm font-medium text-neutral-900 mb-1" numberOfLines={1}>
            {sound.title}
          </Text>
          <Text className="text-xs text-neutral-500" numberOfLines={1}>
            {sound.location.name} • {Math.round(sound.duration)}s
          </Text>
        </View>
        <View className="w-20 h-6 border border-neutral-300 rounded flex items-center justify-center">
          <Text className="text-xs text-neutral-600">Play</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      className={`border border-neutral-300 rounded-lg p-3 ${className}`}
      onPress={onPress}
    >
      <View className="h-20 bg-neutral-50 border border-neutral-200 rounded mb-2 overflow-hidden">
        <Waveform height={80} />
      </View>
      <Text className="text-sm font-medium text-neutral-900 mb-1" numberOfLines={1}>
        {sound.title}
      </Text>
      <Text className="text-xs text-neutral-500" numberOfLines={1}>
        {sound.location.name}
      </Text>
    </TouchableOpacity>
  );
};

export default SoundCard;