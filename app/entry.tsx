// import { Redirect } from 'expo-router';

// export default function Index() {
//   return <Redirect href="/home" />;
// }
import { useTenant } from '@/context/TenantContext';
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

export default function EntryScreen() {
  const router = useRouter();
  const { setTenant } = useTenant();

  const handleSchool = () => {
    router.push('/select-school');
  };

  const handleIndependent = async () => {
    await setTenant({
      type: "independent",
      name: "EdukasoF Global",
    });

    router.replace('/login');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 30 }}>
        Bienvenue sur Edukasof
      </Text>

      <TouchableOpacity
        onPress={handleSchool}
        style={{ padding: 15, backgroundColor: '#1E88E5', marginBottom: 15 }}
      >
        <Text style={{ color: '#fff' }}>
          Mon école utilise Edukasof
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleIndependent}
        style={{ padding: 15, backgroundColor: '#43A047' }}
      >
        <Text style={{ color: '#fff' }}>
          Utiliser Edukasof Quiz
        </Text>
      </TouchableOpacity>
    </View>
  );
}
