import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <SafeAreaProvider>
      <View className={`mx-auto max-w-2xl ${className}`}>{children}</View>
    </SafeAreaProvider>
  );
}
