import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import { MajorMonoDisplay_400Regular } from '@expo-google-fonts/major-mono-display';
import { Michroma_400Regular } from '@expo-google-fonts/michroma';
import {
  IBMPlexSansArabic_400Regular,
  IBMPlexSansArabic_500Medium,
  IBMPlexSansArabic_700Bold,
} from '@expo-google-fonts/ibm-plex-sans-arabic';

import '../global.css';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    MajorMonoDisplay_400Regular,
    Michroma_400Regular,
    IBMPlexSansArabic_400Regular,
    IBMPlexSansArabic_500Medium,
    IBMPlexSansArabic_700Bold,
  });

  if (!fontsLoaded) {
    return null; // Or a loading screen
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="result" />
        <Stack.Screen name="blog" />
      </Stack>
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}
