import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Info } from 'lucide-react-native';
import { measuresService } from '../services/MeasuresService';

interface Thunder {
  id?: string;
  secs: number;
  date?: Date;
  location?: {
    lat: number;
    lng: number;
  };
}

// Simple Map Component for React Native
const MapComponent: React.FC<{ radius: number; location?: { lat: number; lng: number } }> = ({
  radius,
  location,
}) => {
  return (
    <View className="h-48 w-full items-center justify-center rounded-lg border border-white/20 bg-gray-800/50">
      <View className="items-center gap-2">
        <View className="h-16 w-16 items-center justify-center rounded-full border-2 border-blue-400 bg-blue-500/30">
          <View className="h-3 w-3 rounded-full bg-blue-400" />
        </View>
        <Text className="text-center text-xs text-white/60">Ubicación del rayo</Text>
        <Text className="text-center text-xs text-white/80">Radio: ~{Math.round(radius)}m</Text>
      </View>
    </View>
  );
};

export default function ResultScreen() {
  const { time: timeInMs } = useLocalSearchParams<{ time: string }>();

  const [thunder, setThunder] = useState<Thunder | null>(null);
  const [distanceResult, setDistanceResult] = useState<string>('');
  const [timeInSeconds, setTimeInSeconds] = useState<number>(0);
  const [distanceInMeters, setDistanceInMeters] = useState<number>(0);

  useEffect(() => {
    if (!timeInMs) return;

    const timeMs = parseFloat(timeInMs);

    // Calculate distance using the measures service
    const result = measuresService.calculateDistanceFromThunder(timeMs);

    // Create thunder object
    const thunderData: Thunder = {
      id: Date.now().toString(),
      secs: result.timeInSeconds,
      date: new Date(),
      location: {
        lat: 0, // In a real app, this would come from GPS
        lng: 0,
      },
    };

    setThunder(thunderData);
    setDistanceResult(result.distanceFormatted);
    setTimeInSeconds(result.timeInSeconds);
    setDistanceInMeters(result.distanceInMeters);
  }, [timeInMs]);

  const openMap = () => {
    // In a real app, this would open a full-screen map
    Alert.alert('Mapa', 'Función de mapa completo próximamente');
  };

  const showExplanation = () => {
    Alert.alert(
      'Explicación',
      'La distancia se calcula multiplicando el tiempo transcurrido entre ver el rayo y escuchar el trueno por la velocidad del sonido (340 m/s).\n\nEsto nos da una aproximación de qué tan lejos cayó el rayo.',
      [{ text: 'Entendido', style: 'default' }]
    );
  };

  const handleBack = () => {
    router.back();
  };

  if (!thunder) {
    return (
      <ImageBackground
        source={require('../assets/bg-landscape.jpg')}
        className="h-full w-full flex-1 items-center justify-center"
        resizeMode="cover">
        <Text className="text-lg text-white">Calculando...</Text>
      </ImageBackground>
    );
  }

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
      <View className="flex-1 items-center justify-start gap-14 pt-20">
        <View className="w-full max-w-[400px] items-center gap-8">
          {/* Title */}
          <Text className="text-center text-2xl font-bold uppercase tracking-wider text-white">
            RESULTADOS
          </Text>

          {/* Distance Container */}
          <View className="w-full items-center rounded-2xl border border-white/10 bg-black/20 p-8">
            <Text className="mb-2 text-center text-4xl font-bold text-white">{distanceResult}</Text>
            <View className="rounded-lg bg-white/10 px-4 py-2">
              <Text className="font-mono text-lg text-white/80">
                {timeInSeconds.toFixed(2)} secs
              </Text>
            </View>
          </View>

          {/* Map Container */}
          <TouchableOpacity onPress={openMap} className="w-full" activeOpacity={0.8}>
            <MapComponent radius={distanceInMeters} location={thunder.location} />
          </TouchableOpacity>

          {/* Explanation */}
          <TouchableOpacity
            onPress={showExplanation}
            className="flex-row items-center gap-2"
            activeOpacity={0.7}>
            <Info size={16} color="rgba(255, 255, 255, 0.6)" />
            <Text className="text-sm text-white/60 underline">Explicación</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Floating Action Buttons */}

      {/* Back Button - Top Left */}
      <TouchableOpacity
        className="absolute left-5 top-5 rounded-full"
        onPress={handleBack}
        activeOpacity={0.8}>
        <ChevronLeft size={32} color="rgba(255, 255, 255, 0.8)" />
      </TouchableOpacity>
    </ImageBackground>
  );
}
