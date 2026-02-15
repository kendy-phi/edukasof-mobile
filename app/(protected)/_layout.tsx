import { useAuth } from '@/context/AuthContext';
import { Redirect, Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

export default function ProtectedLayout() {
  const { isAuthenticated, loading } = useAuth();

  // 🔄 Pendant qu’on restaure session
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // 🔐 Si pas connecté → login
  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  // ✅ Si connecté → autorisé
  return <Stack screenOptions={{ headerShown: false }} />;
}
