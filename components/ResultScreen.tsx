import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../types/navigation';
import { measuresService } from '../services/MeasuresService';
import { ArrowLeft, Info, RotateCcw, Zap, Clock, Gauge } from 'lucide-react-native';

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
      {/* Header with back button */}
      <View className="mb-8 flex-row items-center">
        <TouchableOpacity
          className="mr-4 rounded-full bg-gray-100 p-2"
          onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="font-ibm-arabic-bold text-xl text-gray-800">Resultado</Text>
      </View>

      <View className="flex-1 items-center justify-center">
        {/* Distance Display with icon */}
        <View className="mb-8 items-center">
          <Zap size={48} color="#1f2937" className="mb-4" />
          <Text className="font-major-mono mb-2 text-4xl font-bold text-gray-800">
            {result.distanceFormatted}
          </Text>
          <Text className="font-ibm-arabic mb-2 text-gray-600">
            {result.timeInSeconds.toFixed(2)} segundos
          </Text>
        </View>

        {/* Details */}
        <View className="mb-8 w-full max-w-xs">
          <Text className="font-ibm-arabic-bold mb-3 text-lg font-semibold text-gray-800">
            Detalles:
          </Text>
          <View className="mb-2 flex-row items-center">
            <Clock size={16} color="#6B7280" />
            <Text className="font-ibm-arabic ml-2 text-gray-600">
              Tiempo: {result.timeInSeconds.toFixed(2)}s
            </Text>
          </View>
          <View className="mb-2 flex-row items-center">
            <Gauge size={16} color="#6B7280" />
            <Text className="font-ibm-arabic ml-2 text-gray-600">
              Velocidad sonido: {measuresService.SOUND_SPEED_m_s} m/s
            </Text>
          </View>
          <View className="flex-row items-center">
            <Zap size={16} color="#6B7280" />
            <Text className="font-ibm-arabic ml-2 text-gray-600">
              Distancia: {result.distanceInMeters.toFixed(0)} metros
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="space-y-3">
          <TouchableOpacity
            className="flex-row items-center justify-center rounded bg-blue-600 px-6 py-3"
            onPress={showExplanation}>
            <Info size={20} color="white" />
            <Text className="font-ibm-arabic-medium ml-2 text-center text-white">Explicación</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center justify-center rounded bg-gray-500 px-6 py-3"
            onPress={() => navigation.goBack()}>
            <RotateCcw size={20} color="white" />
            <Text className="font-ibm-arabic-medium ml-2 text-center text-white">
              Nueva Medición
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
