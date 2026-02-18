import { useAuth } from '@/context/AuthContext';
import { useTenant } from '@/context/TenantContext';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  const router = useRouter();
  const { tenant, loading: tenantLoading } = useTenant();
  const { isAuthenticated, loading: authLoading } = useAuth();

  useEffect(() => {
    if (tenantLoading || authLoading) return;

    // 🔐 Déjà connecté → dashboard
    if (isAuthenticated) {
      router.replace('/dashboard');
      return;
    }

    // 🏫 Tenant déjà sélectionné → login
    if (tenant) {
      console.log(tenant, isAuthenticated)
      router.replace('/home');
      return;
    }

    // ❌ Aucun tenant → écran d’entrée
    router.replace('/entry');
  }, [tenant, tenantLoading, isAuthenticated, authLoading]);

  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
