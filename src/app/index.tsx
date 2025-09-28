import { useState, useRef, useCallback } from 'react';
import { router } from 'expo-router';
import { Zap, Clock, RotateCcw, Menu, Newspaper } from 'lucide-react-native';
import Button from '../components/ui/button';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ImageBackground,
  Dimensions,
} from 'react-native';
import Container from '~/components/container';
import { SafeAreaView } from 'react-native-safe-area-context';

interface StopwatchState {
  time: number;
  isRunning: boolean;
}

export default function HomeScreen() {
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

    router.push({
      pathname: '/result',
      params: { time: timeToUse.toString() },
    });
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
    <View className="h-full w-full">
      <ImageBackground
        source={backgroundImage}
        className="h-full w-full flex-1 items-center justify-center"
        style={{
          width: '100%',
          height: '100%',
        }}
        resizeMode="cover">
        {/* Main Content */}
        <Container className="h-full items-center justify-center gap-20">
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

            <Button onPress={handleMainButton} className="max-w-60 flex-col items-center gap-2">
              <Text className="text-center text-white">{buttonContent.text}</Text>
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
              <Text className="text-center text-sm text-white/60">
                Inserta segundos manualmente
              </Text>
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
        </Container>
      </ImageBackground>

      {/* Floating Action Buttons */}
      <SafeAreaView className="absolute top-0 w-full flex-row justify-between px-4 pt-2">
        <TouchableOpacity
          className="rounded-full bg-black/10 p-3"
          onPress={() => router.push('/blog')}>
          <Newspaper size={20} color="rgba(255, 255, 255, 0.8)" />
        </TouchableOpacity>
        <TouchableOpacity
          className="rounded-full bg-black/10 p-3"
          onPress={() => {
            /* Add menu functionality */
          }}>
          <Menu size={20} color="rgba(255, 255, 255, 0.8)" />
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}
