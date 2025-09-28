import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Info, MapPin } from 'lucide-react-native';
import * as Location from 'expo-location';
import { measuresService } from '../services/MeasuresService';
import MapComponent from '../components/MapComponent';
import { Thunder } from '~/types/thunder';
import Container from '~/components/container';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ResultScreen() {
  const { time: timeInMs } = useLocalSearchParams<{ time: string }>();

  const [thunder, setThunder] = useState<Thunder | null>(null);
  const [distanceResult, setDistanceResult] = useState<string>('');
  const [timeInSeconds, setTimeInSeconds] = useState<number>(0);
  const [distanceInMeters, setDistanceInMeters] = useState<number>(0);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Function to get user location
  const getUserLocation = async (): Promise<{ lat: number; lng: number } | null> => {
    try {
      // Request permission to access location
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError('Permiso de ubicación denegado');
        return null;
      }

      // Get current position
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      return {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      };
    } catch (error) {
      console.error('Error getting location:', error);
      setLocationError('Error al obtener la ubicación');
      return null;
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      if (!timeInMs) return;

      const timeMs = parseFloat(timeInMs);

      // Calculate distance using the measures service
      const result = measuresService.calculateDistanceFromThunder(timeMs);

      // Create thunder object with real or default location
      const thunderData: Thunder = {
        id: Date.now().toString(),
        secs: result.timeInSeconds,
        date: new Date(),
        location: undefined,
      };

      setThunder(thunderData);
      setDistanceResult(result.distanceFormatted);
      setTimeInSeconds(result.timeInSeconds);
      setDistanceInMeters(result.distanceInMeters);

      getUserLocation().then(setLocation);
    };

    initializeData();
  }, [timeInMs]);

  useEffect(() => {
    if (location) {
      setThunder((prev: Thunder | null) => (prev ? { ...prev, location } : null));
      setLocation(null);
    }
  }, [location]);

  const showExplanation = () => {
    const locationText = locationError
      ? '\n\nNota: No se pudo obtener tu ubicación exacta, por lo que se muestra una ubicación aproximada en el mapa.'
      : '\n\nEl mapa muestra tu ubicación actual y el radio estimado donde pudo haber caído el rayo.';

    Alert.alert(
      'Explicación',
      `La distancia se calcula multiplicando el tiempo transcurrido entre ver el rayo y escuchar el trueno por la velocidad del sonido (340 m/s).\n\nEsto nos da una aproximación de qué tan lejos cayó el rayo.${locationText}`,
      [{ text: 'Entendido', style: 'default' }]
    );
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <ImageBackground
      source={require('../assets/bg-landscape.jpg')}
      className="h-full w-full flex-1 items-center justify-center"
      style={{
        width: '100%',
        height: '100%',
      }}
      resizeMode="cover">
      {/* Main Content */}
      <Container className="h-full items-center justify-center gap-20 px-12">
        {/* Title */}
        <Text className="text-center text-2xl font-bold uppercase tracking-wider text-white">
          RESULTADOS
        </Text>

        {/* Distance Container */}
        <View className="w-full items-center rounded-2xl border border-white/10 bg-black/20 p-8">
          <Text className="mb-2 text-center text-4xl font-bold text-white">{distanceResult}</Text>
          <View className="rounded-lg bg-white/10 px-4 py-2">
            <Text className="font-mono text-lg text-white/80">{timeInSeconds.toFixed(2)} secs</Text>
          </View>
        </View>

        {/* Map Container */}
        {thunder?.location ? (
          <View className="w-full">
            {/* Hidden text necesary to render map */}
            <Text className="hidden">Location</Text>
            <View className="h-60 w-full overflow-hidden rounded-2xl">
              <MapComponent radius={distanceInMeters} location={thunder.location} />

              {/* Location status indicator */}
              <View className="mt-2 flex-row items-center justify-center gap-2">
                <MapPin
                  size={12}
                  color={locationError ? 'rgba(239, 68, 68, 0.8)' : 'rgba(34, 197, 94, 0.8)'}
                />
                <Text className={`text-xs ${locationError ? 'text-red-400' : 'text-green-400'}`}>
                  {locationError ? 'Ubicación aproximada' : 'Tu ubicación actual'}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <View className="h-60 w-full items-center justify-center rounded-2xl border border-white/10 bg-black/20 p-8">
            <Text className="text-center text-white">
              Accede a la ubicación{'\n'}para ver el mapa...
            </Text>
          </View>
        )}

        {/* Explanation */}
        <TouchableOpacity
          onPress={showExplanation}
          className="flex-row items-center gap-2"
          activeOpacity={0.7}>
          <Info size={16} color="rgba(255, 255, 255, 0.6)" />
          <Text className="text-sm text-white/60 underline">Explicación</Text>
        </TouchableOpacity>
      </Container>

      {/* Floating Action Buttons */}

      <SafeAreaView className="absolute top-0 w-full flex-row justify-between px-4 pt-2">
        {/* Back Button - Top Left */}
        <TouchableOpacity className="rounded-full" onPress={handleBack} activeOpacity={0.8}>
          <ChevronLeft size={32} color="rgba(255, 255, 255, 0.8)" />
        </TouchableOpacity>
      </SafeAreaView>
    </ImageBackground>
  );
}
