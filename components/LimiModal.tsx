import { useRouter } from 'expo-router';
import { Modal, Pressable, Text, View } from 'react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function LimitModal({ visible, onClose }: Props) {
  const router = useRouter();

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          padding: 24,
        }}
      >
        <View
          style={{
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 20,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: '700',
              marginBottom: 10,
            }}
          >
            🔒 Accès limité
          </Text>

          <Text style={{ marginBottom: 20 }}>
            Vous avez atteint la limite des quiz gratuits.
            Connectez-vous pour continuer.
          </Text>

          <Pressable
            onPress={() => router.push('/login')}
            style={{
              backgroundColor: '#2563eb',
              padding: 12,
              borderRadius: 12,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: 'white', fontWeight: '600' }}>
              Se connecter
            </Text>
          </Pressable>

          <Pressable
            onPress={onClose}
            style={{ marginTop: 12, alignItems: 'center' }}
          >
            <Text style={{ color: '#64748b' }}>
              Plus tard
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
