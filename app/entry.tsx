import { useTenant } from '@/context/TenantContext';
import { useRouter } from 'expo-router';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const C = {
  bg: '#ffffff',
  surface: '#f8fafc',
  border: '#e5e7eb',
  text: '#111827',
  muted: '#6b7280',
  accent: '#2563eb',
  accentDark: '#1e40af',
};

export default function EntryScreen() {
  const router = useRouter();
  const { setTenant } = useTenant();

  const handleSchool = async () => {
    await setTenant({
      type: "full",
      name: "EdukasoF Global",
    });
    router.push('/login');
  };

  const handleIndependent = async () => {
    await setTenant({
      type: "independent",
      name: "EdukasoF Quiz",
    });

    router.replace('/home');
  };

  return (
    <View style={styles.container}>

      {/* Logo */}
      <View style={styles.logoWrapper}>
        <Image
          source={require('@/assets/images/splash.png')}
          style={styles.logo}
        />
      </View>

      {/* Heading */}
      <View style={styles.headingWrapper}>
        <Text style={styles.heading}>Bienvenue</Text>
        <Text style={styles.subtitle}>
          Choisissez comment vous souhaitez utiliser Edukasof
        </Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonWrapper}>

        <Pressable
          onPress={handleSchool}
          style={({ pressed }) => [
            styles.secondaryButton,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.secondaryButtonText}>
            🎓 Mon école utilise Edukasof
          </Text>
        </Pressable>

        <Pressable
          onPress={handleIndependent}
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.primaryButtonText}>
            🧠 Utiliser Edukasof Quiz
          </Text>
        </Pressable>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
    paddingHorizontal: 28,
    justifyContent: 'center',
  },

  logoWrapper: {
    alignItems: 'center',
    marginBottom: 40,
  },

  logo: {
    width: 180,
    height: 180,
    resizeMode: 'contain',
  },

  headingWrapper: {
    alignItems: 'center',
    marginBottom: 50,
  },

  heading: {
    fontSize: 30,
    fontWeight: '700',
    color: C.text,
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    color: C.muted,
    textAlign: 'center',
    paddingHorizontal: 10,
  },

  buttonWrapper: {
    gap: 18,
  },

  primaryButton: {
    backgroundColor: C.accent,
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: C.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 4,
  },

  primaryButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },

  secondaryButton: {
    borderWidth: 1.5,
    borderColor: C.border,
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
  },

  secondaryButtonText: {
    color: C.text,
    fontSize: 15,
    fontWeight: '600',
  },

  buttonPressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.9,
  },
});