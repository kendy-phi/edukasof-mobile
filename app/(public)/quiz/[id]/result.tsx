import Screen from '@/components/Screen';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
export default function QuizResultScreen() {
  const { score, total, percentage } = useLocalSearchParams();
  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();

  return (
    <Screen>
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
      }}
    >
      <Text style={{ fontSize: 28, fontWeight: '800', color:theme.text }}>
        Résultat
      </Text>

      <Text style={{ fontSize: 22, marginTop: 20, color:theme.text }}>
        {score} / {total}
      </Text>

      <Text
        style={{
          fontSize: 18,
          marginTop: 10,
          color: Number(percentage) >= 70 ? '#16a34a' : '#dc2626',
        }}
      >
        {percentage}% — {Number(percentage) >= 70 ? 'Réussi 🎉' : 'Échoué ❌'}
      </Text>

      <Pressable
        onPress={() => isAuthenticated ? router.replace('/(protected)/(tabs)/quizzes') : router.replace('/home')}
        style={{
          marginTop: 40,
          backgroundColor: '#2563eb',
          paddingHorizontal: 24,
          paddingVertical: 14,
          borderRadius: 12,
        }}
      >
        <Text style={{ color: 'white', fontSize: 16 }}>
          Retour à l’accueil
        </Text>
      </Pressable>
    </View>
    </Screen>
  );
}
