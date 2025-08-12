import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../types/navigation';
import { measuresService } from '../services/MeasuresService';

type ResultScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Result'>;
type ResultScreenRouteProp = RouteProp<RootStackParamList, 'Result'>;

export default function ResultScreen() {
  const navigation = useNavigation<ResultScreenNavigationProp>();
  const route = useRoute<ResultScreenRouteProp>();

  const { timeInMs } = route.params;

  const result = useMemo(() => {
    return measuresService.calculateDistanceFromThunder(timeInMs);
  }, [timeInMs]);

  const showExplanation = () => {
    Alert.alert(
      'Explicación',
      `El sonido viaja a aproximadamente ${measuresService.SOUND_SPEED_m_s} m/s. ` +
        `Al multiplicar el tiempo (${result.timeInSeconds.toFixed(2)} segundos) por la velocidad del sonido, ` +
        `obtenemos la distancia aproximada de ${result.distanceInMeters.toFixed(0)} metros.`,
      [{ text: 'Entendido', style: 'default' }]
    );
  };

  return (
    <View className="flex-1 bg-white p-6">
      <View className="flex-1 items-center justify-center">
        {/* Distance Display */}
        <Text className="mb-2 text-4xl font-bold text-gray-800">{result.distanceFormatted}</Text>
        <Text className="mb-8 text-gray-600">{result.timeInSeconds.toFixed(2)} segundos</Text>

        {/* Details */}
        <View className="mb-8 w-full max-w-xs">
          <Text className="mb-3 text-lg font-semibold text-gray-800">Detalles:</Text>
          <Text className="mb-2 text-gray-600">Tiempo: {result.timeInSeconds.toFixed(2)}s</Text>
          <Text className="mb-2 text-gray-600">
            Velocidad sonido: {measuresService.SOUND_SPEED_m_s} m/s
          </Text>
          <Text className="text-gray-600">
            Distancia: {result.distanceInMeters.toFixed(0)} metros
          </Text>
        </View>

        {/* Action Buttons */}
        <View className="space-y-3">
          <TouchableOpacity className="rounded bg-blue-600 px-6 py-3" onPress={showExplanation}>
            <Text className="text-center text-white">Explicación</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="rounded bg-gray-500 px-6 py-3"
            onPress={() => navigation.goBack()}>
            <Text className="text-center text-white">Nueva Medición</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
