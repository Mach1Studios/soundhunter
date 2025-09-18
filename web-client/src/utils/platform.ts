import { Platform } from 'react-native';

export const isWeb = Platform.OS === 'web';
export const isNative = Platform.OS !== 'web';
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

export const platformSelect = <T>(options: {
  web?: T;
  native?: T;
  ios?: T;
  android?: T;
  default?: T;
}): T => {
  if (isWeb && options.web !== undefined) return options.web;
  if (isIOS && options.ios !== undefined) return options.ios;
  if (isAndroid && options.android !== undefined) return options.android;
  if (isNative && options.native !== undefined) return options.native;
  if (options.default !== undefined) return options.default;
  
  throw new Error('No matching platform option found');
};

export const getResponsiveValue = (mobile: number, tablet: number, desktop: number) => {
  if (isWeb) {
    // On web, we'll use CSS media queries, return desktop as default
    return desktop;
  }
  // On native, determine based on screen size
  return mobile; // Simplified for now
};