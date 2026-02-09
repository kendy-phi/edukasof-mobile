import { router } from 'expo-router';
import { Button, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20, marginBottom: 12 }}>
        🧠 Welcome to Edukasof
      </Text>

      <Button
        title="Take a free quiz"
        onPress={() => router.push('/quizzes')}
      />
    </View>
  );
}
