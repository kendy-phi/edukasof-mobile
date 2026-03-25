import React from 'react';
import { View } from 'react-native';

export default function ProgressBar({
  progress,
  theme,
}: {
  progress: number;
  theme: any;
}) {
  return (
    <View
      style={{
        height: 10,
        backgroundColor: theme.border,
        borderRadius: 10,
        overflow: 'hidden',
      }}
    >
      <View
        style={{
          width: `${progress * 100}%`,
          height: '100%',
          backgroundColor: theme.primary,
        }}
      />
    </View>
  );
}