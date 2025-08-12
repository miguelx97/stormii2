import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../types/navigation';
import { Zap, Clock, RotateCcw, Menu, History, FileText } from 'lucide-react-native';

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

  const screenData = Dimensions.get('window');
  const isLandscape = screenData.width > screenData.height;
  const isLargeScreen = screenData.width > 800;

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

  const getButtonText = () => {
    if (!stopwatch.isRunning && stopwatch.time === 0) {
      return { text: 'EMPIEZA CUANDO\nVEAS EL RAYO', icon: Zap };
    } else if (stopwatch.isRunning) {
      return { text: 'TERMINA CUANDO\nESCUCHES EL TRUENO', icon: Clock };
    } else {
      return { text: 'CONTINUAR CUANDO\nVEAS EL RAYO', icon: Zap };
    }
  };

  const buttonContent = getButtonText();
  const hasTimer = stopwatch.time > 0;
  const hasManualInput = manualTime.trim() !== '';

  return (
    <ImageBackground
      source={
        isLargeScreen || isLandscape
          ? require('../assets/bg-landscape.jpg')
          : require('../assets/bg.jpg')
      }
      className="flex-1"
      resizeMode="cover">
      {/* Main Content */}
      <View
        className="flex-1 items-center justify-center px-6"
        style={{ maxWidth: 500, alignSelf: 'center', width: '100%' }}>
        {/* Title */}
        <View style={{ marginVertical: screenData.height * 0.09 }}>
          <Text
            className="text-center uppercase tracking-[2px] text-white"
            style={{
              fontSize: 32,
              fontWeight: 'bold',
              textShadowColor: 'rgba(0, 0, 0, 0.75)',
              textShadowOffset: { width: -1, height: 1 },
              textShadowRadius: 10,
            }}>
            STORMII
          </Text>
        </View>

        {/* Timer Section */}
        <View
          className={hasManualInput ? 'opacity-20' : ''}
          pointerEvents={hasManualInput ? 'none' : 'auto'}>
          {/* Timer Button */}
          <TouchableOpacity
            className="mb-4 items-center justify-center rounded-2xl bg-black/20 opacity-80"
            style={{ width: 200, height: 100 }}
            onPress={stopwatch.isRunning ? stopStopwatch : startStopwatch}>
            <Text
              className="mb-2 text-center uppercase text-white"
              style={{
                fontSize: 12,
                lineHeight: 18,
                fontFamily: 'IBMPlexSansArabic',
                letterSpacing: 2,
              }}>
              {buttonContent.text}
            </Text>
            <buttonContent.icon size={30} color="white" />
          </TouchableOpacity>

          {/* Timer Display */}
          <View className="mb-4">
            <Text
              className="text-center text-white"
              style={{
                fontSize: 50,
                fontFamily: 'MajorMonoDisplay',
                textShadowColor: 'rgba(0, 0, 0, 0.75)',
                textShadowOffset: { width: -1, height: 1 },
                textShadowRadius: 10,
              }}>
              {formatTime(stopwatch.time)}
            </Text>
          </View>
        </View>

        {/* Manual Input Section */}
        <View
          className={hasTimer ? 'opacity-20' : ''}
          style={{ width: 300, marginVertical: screenData.height * 0.09 }}
          pointerEvents={hasTimer ? 'none' : 'auto'}>
          <View className="mb-4 flex-row items-center justify-center">
            <Clock size={16} color="rgba(255, 255, 255, 0.6)" style={{ marginRight: 7 }} />
            <Text className="text-center text-sm text-white/60">Inserta segundos manualmente</Text>
          </View>
          <View className="border-b border-white/30 bg-transparent">
            <TextInput
              className="py-3 text-center text-white"
              style={{ fontSize: 16 }}
              placeholder="0.00"
              value={manualTime}
              onChangeText={setManualTime}
              keyboardType="numeric"
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              editable={!hasTimer}
            />
          </View>
        </View>

        {/* Calculate Button */}
        <TouchableOpacity
          className="items-center justify-center rounded-2xl bg-black/20 opacity-80"
          style={{ width: 200, marginTop: screenData.height * 0.09 }}
          onPress={handleCalculate}>
          <Text
            className="py-4 text-center uppercase text-white"
            style={{
              fontSize: 16,
              fontFamily: 'IBMPlexSansArabic',
              letterSpacing: 2,
              fontWeight: 'bold',
            }}>
            CALCULAR
          </Text>
        </TouchableOpacity>

        {/* Reset Button */}
        {hasTimer && (
          <TouchableOpacity
            className="mt-4 items-center justify-center rounded-xl bg-white/20 px-6 py-2"
            onPress={resetStopwatch}>
            <View className="flex-row items-center">
              <RotateCcw size={16} color="white" />
              <Text className="ml-2 uppercase text-white" style={{ letterSpacing: 1 }}>
                RESET
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* Floating Action Buttons */}
      {/* Menu Button - Top Right */}
      <TouchableOpacity
        className="absolute rounded-full bg-black/30 p-3"
        style={{ top: 40, right: 20 }}
        onPress={() => {
          /* Add menu functionality */
        }}>
        <Menu size={20} color="rgba(255, 255, 255, 0.8)" />
      </TouchableOpacity>

      {/* History Button - Bottom Right */}
      <TouchableOpacity
        className="absolute rounded-full bg-black/30 p-3"
        style={{ bottom: 40, right: 20 }}
        onPress={() => navigation.navigate('Result', { timeInMs: 1000 })}>
        <History size={20} color="rgba(255, 255, 255, 0.8)" />
      </TouchableOpacity>

      {/* Blog Button - Top Left */}
      <TouchableOpacity
        className="absolute rounded-full bg-black/30 p-3"
        style={{ top: 40, left: 20 }}
        onPress={() => {
          /* Add blog navigation */
        }}>
        <FileText size={20} color="rgba(255, 255, 255, 0.8)" />
      </TouchableOpacity>
    </ImageBackground>
  );
}
