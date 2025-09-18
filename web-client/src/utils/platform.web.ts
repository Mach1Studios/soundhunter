// Web-specific platform utilities
export const isWeb = true;
export const isNative = false;
export const isIOS = false;
export const isAndroid = false;

export const platformSelect = <T>(options: {
  web?: T;
  native?: T;
  ios?: T;
  android?: T;
  default?: T;
}): T => {
  if (options.web !== undefined) return options.web;
  if (options.default !== undefined) return options.default;
  
  throw new Error('No matching platform option found');
};

export const getResponsiveValue = (mobile: number, tablet: number, desktop: number) => {
  return desktop; // On web, return desktop as default
};