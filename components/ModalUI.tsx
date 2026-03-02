import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'expo-router';
import { Modal, Pressable, Text, View } from 'react-native';

type Props = {
  visible: boolean;
  setVisible: (v: boolean) => void
  modalTitle: string;
  bodyText: string;
};

export default function CustomModal({ visible, setVisible, modalTitle, bodyText }: Props) {
  const router = useRouter();
  const { theme } = useTheme();
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View
        style={{
          flex: 1,
          backgroundColor: theme.background,
          justifyContent: 'center',
          padding: 24,
        }}
      >
        <View
          style={{
            backgroundColor: theme.primary,
            padding: 20,
            borderRadius: 20,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: '700',
              marginBottom: 10,
              color: theme.text
            }}
          >
            {modalTitle ?? ''}
          </Text>

          <Text style={{ marginBottom: 20, color: theme.text }}>
            {bodyText ?? ''}
          </Text>

          <Pressable
            onPress={() => { setVisible(false)}}
            style={{
              backgroundColor: theme.background,
              padding: 12,
              borderRadius: 12,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: theme.text, fontWeight: '600' }}>
             OK
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
