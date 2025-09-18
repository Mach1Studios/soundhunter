const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Add support for .web.tsx extensions
config.resolver.platforms = ['ios', 'android', 'native', 'web'];
config.resolver.sourceExts.push('web.tsx', 'web.ts', 'web.jsx', 'web.js');

module.exports = withNativeWind(config, { input: './app/globals.css' });