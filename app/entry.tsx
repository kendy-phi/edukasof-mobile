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

  const handleSchool = () => {
    router.push('/select-school');
  };

  const handleIndependent = async () => {
    await setTenant({
      type: "independent",
      name: "EdukasoF Global",
    });

    router.replace('/home');
  };

  return (
    <View style={styles.container}>

      {/* Logo */}
      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <Image
          source={require('@/assets/images/splash.png')}
          style={{
            width: 200,
            height: 200,
            borderRadius: 20,
          }}
        />
      </View>

      {/* Heading */}
      <View style={styles.logoWrapper}>
        <Text style={styles.title}>Bienvenue</Text>
        <Text style={styles.subtitle}>
          Choisissez votre mode d’utilisation
        </Text>
      </View>

      {/* Cards */}
      <View style={styles.cardWrapper}>

        <Pressable
          onPress={handleSchool}
          style={({ pressed }) => [
            styles.card,
            pressed && styles.cardPressed
          ]}
        >
          <Text style={styles.cardTitle}>
            🎓 Mon école utilise Edukasof
          </Text>
          <Text style={styles.cardDescription}>
            Accédez à votre espace académique et vos évaluations.
          </Text>
        </Pressable>

        <Pressable
          onPress={handleIndependent}
          style={({ pressed }) => [
            styles.card,
            styles.primaryCard,
            pressed && styles.cardPressed
          ]}
        >
          <Text style={styles.primaryCardTitle}>
            🧠 Utiliser Edukasof Quiz
          </Text>
          <Text style={styles.primaryCardDescription}>
            Passez des quiz et améliorez vos compétences.
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
    paddingVertical: 60,
    justifyContent: 'space-between',
  },

  logoWrapper: {
    alignItems: 'center',
  },

  logoBox: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: C.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  logoText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
  },

  brand: {
    fontSize: 20,
    fontWeight: '600',
    color: C.text,
  },

  headingWrapper: {
    marginTop: 40,
    textAlign: 'center',
    borderColor: 'black'
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: C.text,
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    color: C.muted,
  },

  cardWrapper: {
    marginTop: 40,
    gap: 16,
  },

  card: {
    backgroundColor: C.surface,
    padding: 22,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
  },

  primaryCard: {
    backgroundColor: C.accent,
    borderColor: C.accent,
  },

  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: C.text,
    marginBottom: 6,
  },

  cardDescription: {
    fontSize: 13,
    color: C.muted,
  },

  primaryCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 6,
  },

  primaryCardDescription: {
    fontSize: 13,
    color: '#e0ecff',
  },
});
