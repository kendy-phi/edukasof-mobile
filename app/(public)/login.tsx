import LoginUI from '@/components/LoginUI'; // ← ton design déplacé ici
import { useAuth } from '@/context/AuthContext';
import { useTenant } from '@/context/TenantContext';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert
} from 'react-native';

export default function LoginScreen() {
  const { login, loading } = useAuth();
  const { tenant } = useTenant();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }

    try {
      setSubmitting(true);
      await login(email, password);

      router.replace('/dashboard');
    } catch (error: any) {
      console.error(error);
      
      Alert.alert("Erreur", "Email ou mot de passe incorrect.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <LoginUI
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleLogin={handleLogin}
      loading={submitting}
      tenant={tenant}
    />
  );
}
