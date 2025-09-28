import { SafeAreaView } from 'react-native-safe-area-context';

export default function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <SafeAreaView className={`mx-auto w-full max-w-2xl ${className}`}>{children}</SafeAreaView>
  );
}
