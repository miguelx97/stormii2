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
import { Zap, Clock, RotateCcw, Menu, Newspaper } from 'lucide-react-native';
import Button from './ui/button';

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

  // Get screen dimensions to determine which background image to use
  const { width: screenWidth } = Dimensions.get('window');
  const backgroundImage =
    screenWidth > 800 ? require('../assets/bg-landscape.jpg') : require('../assets/bg.jpg');

  const formatTime = (milliseconds: number): string => {
    const seconds = Math.floor(milliseconds / 1000);
    const ms = Math.floor((milliseconds % 1000) / 10); // Get centiseconds (10ms precision)

    return `${seconds.toString().padStart(2, '0')}:${ms.toString().padStart(2, '0')}`;
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
    setManualTime('');
    startTimeRef.current = null;
  }, []);

  const handleMainButton = () => {
    if (stopwatch.isRunning) {
      stopStopwatch();
    } else if (stopwatch.time > 0) {
      resetStopwatch();
    } else {
      startStopwatch();
    }
  };

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
      return { text: 'REINICIAR\nCRONÓMETRO', icon: RotateCcw };
    }
  };

  const buttonContent = getButtonText();
  const hasTimer = stopwatch.time > 0;
  const hasManualInput = manualTime.trim() !== '';

  return (
    <ImageBackground
      source={backgroundImage}
      className="h-full w-full flex-1 items-center justify-center"
      style={{
        width: '100%',
        height: '100%',
      }}
      resizeMode="cover">
      {/* Main Content */}
      <View className="w-full max-w-[500px] flex-1 items-center justify-start gap-14 pt-20">
        {/* Title */}
        <View className="my-15">
          <Text className="text-center font-michroma text-2xl uppercase tracking-[2px] text-white">
            STORMII
          </Text>
        </View>

        {/* Timer Section */}
        <View
          className={`${hasManualInput ? 'opacity-20' : ''} gap-4`}
          pointerEvents={hasManualInput ? 'none' : 'auto'}>
          {/* Timer Button */}
          <Button onPress={handleMainButton} className="max-w-60">
            {buttonContent.text}
            <buttonContent.icon size={30} color="white" />
          </Button>

          {/* Timer Display */}
          <View className="mb-4">
            <Text className="text-center font-major-mono text-5xl text-white">
              {formatTime(stopwatch.time)}
            </Text>
          </View>
        </View>

        {/* Manual Input Section */}
        <View
          className={`my-15 w-60 ${hasTimer ? 'opacity-20' : ''}`}
          pointerEvents={hasTimer ? 'none' : 'auto'}>
          <View className="mb-4 flex-row items-center justify-center">
            <Clock size={16} color="rgba(255, 255, 255, 0.6)" className="mr-[7px]" />
            <Text className="text-center text-sm text-white/60">Inserta segundos manualmente</Text>
          </View>
          <View className="border-b border-white/30 bg-transparent">
            <TextInput
              className="py-3 text-center text-base text-white outline-none"
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
        <Button onPress={handleCalculate} className="w-60">
          CALCULAR
        </Button>
      </View>

      {/* Floating Action Buttons */}
      {/* Menu Button - Top Right */}
      <TouchableOpacity
        className="absolute right-5 top-5 rounded-full bg-black/10 p-3"
        onPress={() => {
          /* Add menu functionality */
        }}>
        <Menu size={20} color="rgba(255, 255, 255, 0.8)" />
      </TouchableOpacity>

      {/* Blog Button - Top Left */}
      <TouchableOpacity
        className="absolute left-5 top-5 rounded-full bg-black/10 p-3"
        onPress={() => {
          /* Add blog navigation */
        }}>
        <Newspaper size={20} color="rgba(255, 255, 255, 0.8)" />
      </TouchableOpacity>
    </ImageBackground>
  );
}
