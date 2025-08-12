import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../types/navigation';

type ResultScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Result'>;

export default function ResultScreen() {
  const navigation = useNavigation<ResultScreenNavigationProp>();

  return (
    <View className="flex-1 bg-blue-50 p-6">
      <View className="flex-1 items-center justify-center">
        <Text className="mb-6 text-3xl font-bold text-blue-800">Results Dashboard</Text>

        <Text className="mb-8 text-center text-lg text-gray-700">
          Here you can view all your results and analytics
        </Text>

        <View className="mb-8 w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
          <Text className="mb-2 text-lg font-semibold text-gray-800">Latest Results</Text>
          <Text className="text-gray-600">• Result 1: 95% accuracy</Text>
          <Text className="text-gray-600">• Result 2: 87% accuracy</Text>
          <Text className="text-gray-600">• Result 3: 92% accuracy</Text>
        </View>

        <TouchableOpacity
          className="w-full max-w-sm rounded-lg bg-blue-500 p-4 shadow-lg"
          onPress={() => navigation.goBack()}>
          <Text className="text-center text-lg font-semibold text-white">Back to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
