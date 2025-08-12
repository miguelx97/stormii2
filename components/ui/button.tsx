import { Text, TouchableOpacity } from 'react-native';

export default function Button({
  children,
  onPress,
  className,
}: {
  children: React.ReactNode;
  onPress: () => void;
  className?: string;
}) {
  return (
    <TouchableOpacity
      className={`items-center justify-center rounded-2xl bg-[#3a4573]/80 px-4 py-2 text-center font-ibm-arabic text-base uppercase tracking-[2px] text-white opacity-80 ${className}`}
      onPress={onPress}>
      {children}
    </TouchableOpacity>
  );
}
