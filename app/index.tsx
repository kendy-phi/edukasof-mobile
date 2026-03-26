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
    console.log(`Loading tenant`, tenantLoading, authLoading);
    
    if (tenantLoading || authLoading) return;

    // 🔐 Déjà connecté → dashboard
    if (isAuthenticated) {
      console.log(`Already auth redirect to dashboard`);
      router.replace('/dashboard');
      return;
    }

    // 🏫 Tenant déjà sélectionné → login
    if (tenant) {
      console.log(`Load teanant and redirected to home page: `,tenant, isAuthenticated)
      router.replace('/home');
      return;
    }
    console.log(`retdirect to entry page.`);
    
    // ❌ Aucun tenant → écran d’entrée
    router.replace('/entry');
  }, [tenant, tenantLoading, isAuthenticated, authLoading]);

  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
