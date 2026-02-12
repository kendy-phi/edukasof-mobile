import { View, Text, Pressable } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';

export default function QuizResultScreen() {
  const { score, total, percentage } = useLocalSearchParams();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
      }}
    >
      <Text style={{ fontSize: 28, fontWeight: '800' }}>
        Résultat
      </Text>

      <Text style={{ fontSize: 22, marginTop: 20 }}>
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
        onPress={() => router.replace('/')}
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
  );
}
