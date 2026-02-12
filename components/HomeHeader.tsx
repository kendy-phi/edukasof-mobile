import { View, Text, Pressable } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

export default function HomeHeader() {
  const { theme, toggleTheme, mode } = useTheme();

  return (
    <View style={{ marginBottom: 24 }}>
      <Text
        style={{
          fontSize: 26,
          fontWeight: '800',
          color: theme.text,
        }}
      >
        Bonjour 👋
      </Text>

      <Text
        style={{
          marginTop: 4,
          fontSize: 16,
          color: theme.secondaryText,
        }}
      >
        Prêt à relever un nouveau défi ?
      </Text>

      <Pressable
        onPress={toggleTheme}
        style={{
          marginTop: 16,
          paddingVertical: 8,
          paddingHorizontal: 14,
          borderRadius: 12,
          backgroundColor: theme.card,
          borderWidth: 1,
          borderColor: theme.border,
          alignSelf: 'flex-start',
        }}
      >
        <Text style={{ color: theme.text }}>
          {mode === 'light' ? '🌙 Mode sombre' : '☀️ Mode clair'}
        </Text>
      </Pressable>
    </View>
  );
}
