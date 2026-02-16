import { useTenant } from '@/context/TenantContext';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SelectSchool() {
  const { setTenant } = useTenant();
  const router = useRouter();
  const [domain, setDomain] = useState('');

  const handleContinue = async () => {
    await setTenant({
      type: "full",
      name: domain,
      baseURL: `https://${domain}.edukasof.com`,
    });

    router.replace('/login');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text>Entrer le domaine de votre école</Text>

      <TextInput
        value={domain}
        onChangeText={setDomain}
        placeholder="college-lumiere"
        style={{ borderWidth: 1, marginVertical: 20, padding: 10 }}
      />

      <TouchableOpacity
        onPress={handleContinue}
        style={{ padding: 15, backgroundColor: '#1E88E5' }}
      >
        <Text style={{ color: '#fff' }}>Continuer</Text>
      </TouchableOpacity>
    </View>
  );
}