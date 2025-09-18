import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Text } from 'react-native';

// Import screens
import DiscoverScreen from '../screens/DiscoverScreen';
import SearchScreen from '../screens/SearchScreen';
import MapScreen from '../screens/MapScreen';
import LibraryScreen from '../screens/LibraryScreen';
import SoundDetailScreen from '../screens/SoundDetailScreen';

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
          paddingTop: 8,
          paddingBottom: 8,
          height: 60,
        },
        tabBarActiveTintColor: '#171717',
        tabBarInactiveTintColor: '#737373',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tab.Screen 
        name="Discover" 
        component={DiscoverScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 18, opacity: focused ? 1 : 0.6 }}>🔍</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Search" 
        component={SearchScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 18, opacity: focused ? 1 : 0.6 }}>🎵</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Map" 
        component={MapScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 18, opacity: focused ? 1 : 0.6 }}>🗺️</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Library" 
        component={LibraryScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 18, opacity: focused ? 1 : 0.6 }}>📚</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Root Stack Navigator
export default function AppNavigator() {
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
              borderBottomWidth: 1,
            },
            headerTintColor: '#171717',
            headerTitleStyle: {
              fontSize: 16,
              fontWeight: '600',
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

