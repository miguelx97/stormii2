import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../types/navigation';

type BlogScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Blog'>;

export default function BlogScreen() {
  const navigation = useNavigation<BlogScreenNavigationProp>();

  const blogPosts = [
    {
      id: 1,
      title: 'Getting Started with Stormii',
      excerpt: 'Learn the basics of using Stormii for your daily workflows...',
      date: 'Dec 15, 2024',
    },
    {
      id: 2,
      title: 'Advanced Features Guide',
      excerpt: 'Discover powerful features that can boost your productivity...',
      date: 'Dec 10, 2024',
    },
    {
      id: 3,
      title: 'Tips and Tricks',
      excerpt: 'Expert tips to get the most out of your Stormii experience...',
      date: 'Dec 5, 2024',
    },
  ];

  return (
    <View className="flex-1 bg-green-50">
      <ScrollView className="flex-1 p-6">
        <Text className="mb-6 text-center text-3xl font-bold text-green-800">Stormii Blog</Text>

        <Text className="mb-8 text-center text-lg text-gray-700">
          Stay updated with the latest news and tutorials
        </Text>

        {blogPosts.map((post) => (
          <View key={post.id} className="mb-4 rounded-lg bg-white p-5 shadow-lg">
            <Text className="mb-2 text-xl font-semibold text-gray-800">{post.title}</Text>
            <Text className="mb-3 text-gray-600">{post.excerpt}</Text>
            <Text className="text-sm font-medium text-green-600">{post.date}</Text>
          </View>
        ))}

        <TouchableOpacity
          className="mt-6 rounded-lg bg-green-500 p-4 shadow-lg"
          onPress={() => navigation.goBack()}>
          <Text className="text-center text-lg font-semibold text-white">Back to Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
