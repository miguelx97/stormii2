import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../types/navigation';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <View className="flex-1 items-center justify-center bg-gray-50 p-6">
      <Text className="mb-8 text-4xl font-bold text-gray-800">Welcome to Stormii</Text>

      <Text className="mb-12 text-center text-lg text-gray-600">
        Navigate to different sections of the app
      </Text>

      <View className="w-full max-w-sm space-y-4">
        <TouchableOpacity
          className="rounded-lg bg-blue-500 p-4 shadow-lg"
          onPress={() => navigation.navigate('Result')}>
          <Text className="text-center text-lg font-semibold text-white">View Results</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="rounded-lg bg-green-500 p-4 shadow-lg"
          onPress={() => navigation.navigate('Blog')}>
          <Text className="text-center text-lg font-semibold text-white">Read Blog</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
