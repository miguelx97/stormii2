import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

export default function Button({
  children,
  onPress,
  className,
}: {
  children: React.ReactNode;
  onPress: () => void;
  className?: string;
}) {
  // Función para determinar si children es solo texto
  const isTextOnly = (children: React.ReactNode): boolean => {
    return typeof children === 'string' || typeof children === 'number';
  };

  return (
    <TouchableOpacity
      className={`items-center justify-center rounded-2xl bg-[#3a4573]/80 px-4 py-2 text-center font-ibm-arabic text-base uppercase tracking-[2px] opacity-80 ${className}`}
      onPress={onPress}>
      {isTextOnly(children) ? (
        <Text className="text-xl tracking-widest text-white">{children}</Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}
