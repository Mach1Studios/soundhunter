import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Text } from 'react-native';

// Import screens
import DiscoverScreen from './src/screens/DiscoverScreen';
import SearchScreen from './src/screens/SearchScreen';
import MapScreen from './src/screens/MapScreen';
import SoundDetailScreen from './src/screens/SoundDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Tab Navigator for main screens
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopColor: '#d4d4d4',
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: '#171717',
        tabBarInactiveTintColor: '#737373',
      }}
    >
      <Tab.Screen 
        name="Discover" 
        component={DiscoverScreen}
        options={{
          tabBarIcon: () => <Text>🔍</Text>,
        }}
      />
      <Tab.Screen 
        name="Search" 
        component={SearchScreen}
        options={{
          tabBarIcon: () => <Text>🎵</Text>,
        }}
      />
      <Tab.Screen 
        name="Map" 
        component={MapScreen}
        options={{
          tabBarIcon: () => <Text>🗺️</Text>,
        }}
      />
      <Tab.Screen 
        name="Library" 
        component={DiscoverScreen} // Placeholder
        options={{
          tabBarIcon: () => <Text>📚</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

// Root Stack Navigator
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen 
          name="SoundDetail" 
          component={SoundDetailScreen}
          options={{
            headerShown: true,
            headerTitle: 'Sound Detail',
            headerStyle: {
              backgroundColor: 'white',
              borderBottomColor: '#d4d4d4',
            },
            headerTintColor: '#171717',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}