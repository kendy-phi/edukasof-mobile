import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22 }}>
        Bienvenue {user?.name}
      </Text>

      <Pressable
        onPress={logout}
        style={{
          marginTop: 20,
          backgroundColor: 'red',
          padding: 12,
          borderRadius: 10,
        }}
      >
        <Text style={{ color: 'white' }}>Logout</Text>
      </Pressable>

      <Pressable
        onPress={() =>{
          router.replace('/home')
        }}
        style={{
          marginTop: 20,
          backgroundColor: 'blue',
          padding: 12,
          borderRadius: 10,
        }}
      >
        <Text style={{ color: 'white' }}>Home</Text>
      </Pressable>
    </View>
  );
}
