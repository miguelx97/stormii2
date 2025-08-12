import React, { useState, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../types/navigation';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface StopwatchState {
  time: number;
  isRunning: boolean;
}

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [stopwatch, setStopwatch] = useState<StopwatchState>({ time: 0, isRunning: false });
  const [manualTime, setManualTime] = useState<string>('');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const formatTime = (milliseconds: number): string => {
    const seconds = Math.floor(milliseconds / 1000);
    const ms = Math.floor((milliseconds % 1000) / 10); // Get centiseconds (10ms precision)

    return `${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  const startStopwatch = useCallback(() => {
    if (stopwatch.isRunning) return;

    startTimeRef.current = Date.now() - stopwatch.time;
    setStopwatch((prev) => ({ ...prev, isRunning: true }));

    intervalRef.current = setInterval(() => {
      if (startTimeRef.current) {
        setStopwatch((prev) => ({
          ...prev,
          time: Date.now() - startTimeRef.current!,
        }));
      }
    }, 10);
  }, [stopwatch.isRunning, stopwatch.time]);

  const stopStopwatch = useCallback(() => {
    if (!stopwatch.isRunning) return;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setStopwatch((prev) => ({ ...prev, isRunning: false }));
  }, [stopwatch.isRunning]);

  const resetStopwatch = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setStopwatch({ time: 0, isRunning: false });
    startTimeRef.current = null;
  }, []);

  const handleCalculate = () => {
    let timeToUse = 0;

    if (stopwatch.time > 0) {
      timeToUse = stopwatch.time;
    } else if (manualTime.trim() !== '') {
      const parsedTime = parseFloat(manualTime);
      if (isNaN(parsedTime) || parsedTime < 0) {
        Alert.alert('Error', 'Por favor introduce un tiempo válido en segundos');
        return;
      }
      timeToUse = parsedTime * 1000; // Convert seconds to milliseconds
    } else {
      Alert.alert('Error', 'Por favor usa el cronómetro o introduce el tiempo manualmente');
      return;
    }

    if (timeToUse === 0) {
      Alert.alert('Error', 'El tiempo no puede ser 0');
      return;
    }

    navigation.navigate('Result', { timeInMs: timeToUse });
  };

  return (
    <View className="flex-1">
      {/* Background with storm gradient */}
      <View className="flex-1 bg-gradient-to-b from-purple-500 via-pink-400 to-orange-400">
        {/* Lightning overlay effect */}
        <View className="absolute inset-0 bg-black/20" />

        {/* Content */}
        <View className="flex-1 items-center justify-center px-6">
          {/* Logo */}
          <View className="mb-16">
            <Text className="text-5xl font-bold tracking-[0.2em] text-white">STORMII</Text>
          </View>

          {/* Main Action Button */}
          <TouchableOpacity
            className={`mb-12 w-80 rounded-2xl px-8 py-6 ${
              stopwatch.isRunning ? 'bg-red-600/90' : 'bg-slate-700/90'
            }`}
            onPress={stopwatch.isRunning ? stopStopwatch : startStopwatch}>
            <View className="items-center">
              <Text className="mb-2 text-center text-lg font-medium uppercase text-white">
                {stopwatch.isRunning ? 'TERMINA CUANDO' : 'EMPIEZA CUANDO'}
              </Text>
              <Text className="mb-2 text-center text-lg font-medium uppercase text-white">
                {stopwatch.isRunning ? 'ESCUCHES EL TRUENO' : 'VEAS EL RAYO'}
              </Text>
              <Text className="text-4xl text-white">⚡</Text>
            </View>
          </TouchableOpacity>

          {/* Timer Display */}
          <View className="mb-16">
            <Text className="font-mono text-6xl font-bold text-white">
              {formatTime(stopwatch.time)}
            </Text>
          </View>

          {/* Manual Input Section */}
          <View className="mb-16 w-80">
            <View className="mb-4 flex-row items-center justify-center">
              <Text className="text-2xl text-white/80">🕐</Text>
              <Text className="ml-2 text-white/80">Inserta segundos manualmente</Text>
            </View>
            <TextInput
              className="rounded-xl bg-white/20 px-4 py-4 text-center text-lg text-white placeholder-white/60"
              placeholder="0.00"
              value={manualTime}
              onChangeText={setManualTime}
              keyboardType="numeric"
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
            />
          </View>

          {/* Calculate Button */}
          <TouchableOpacity
            className="w-80 rounded-2xl bg-blue-600 px-8 py-4"
            onPress={handleCalculate}>
            <Text className="text-center text-xl font-bold uppercase text-white">CALCULAR</Text>
          </TouchableOpacity>

          {/* Reset Button */}
          {stopwatch.time > 0 && (
            <TouchableOpacity
              className="mt-4 rounded-xl bg-white/20 px-6 py-2"
              onPress={resetStopwatch}>
              <Text className="text-center text-white">RESET</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}
