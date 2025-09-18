import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { platformSelect } from '../../utils/platform';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  showHeader?: boolean;
  showNavigation?: boolean;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  title = 'Soundhunter',
  showHeader = true,
  showNavigation = true
}) => {
  const isWeb = platformSelect({
    web: true,
    native: false,
    default: false
  });

  const navigationItems = [
    { name: 'Discover', icon: '🔍' },
    { name: 'Search', icon: '🎵' },
    { name: 'Map', icon: '🗺️' },
    { name: 'Library', icon: '📚' },
  ];

  // Mobile Layout
  return (
    <SafeAreaView className="flex-1 bg-white">
      {showHeader && (
        <View className="bg-white border-b border-neutral-200 px-4 py-3">
          <View className="flex-row items-center gap-3">
            <View className="w-7 h-7 rounded border border-neutral-300 bg-neutral-900" />
            <Text className="text-base font-semibold text-neutral-900">
              {title}
            </Text>
          </View>
        </View>
      )}
      
      <View className="flex-1">
        {children}
      </View>
      
      {showNavigation && (
        <View className="bg-white border-t border-neutral-200 px-4 py-2 safe-area-bottom">
          <View className="flex-row justify-around">
            {navigationItems.map((item) => (
              <TouchableOpacity
                key={item.name}
                className="items-center py-2 px-3"
              >
                <Text className="text-lg mb-1">{item.icon}</Text>
                <Text className="text-xs text-neutral-600">{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Layout;