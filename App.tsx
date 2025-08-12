import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import HomeScreen from './components/HomeScreen';
import ResultScreen from './components/ResultScreen';
import BlogScreen from './components/BlogScreen';
import type { RootStackParamList } from './types/navigation';

import './global.css';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#f8fafc',
            },
            headerTintColor: '#1f2937',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}>
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Stormii Home' }} />
          <Stack.Screen name="Result" component={ResultScreen} options={{ title: 'Results' }} />
          <Stack.Screen name="Blog" component={BlogScreen} options={{ title: 'Blog' }} />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
