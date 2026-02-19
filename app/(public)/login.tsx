import LoginUI from '@/components/LoginUI'; // ← ton design déplacé ici
import CustomModal from '@/components/ModalUI';
import { useAuth } from '@/context/AuthContext';
import { useTenant } from '@/context/TenantContext';
import { router } from 'expo-router';
import React, { useState } from 'react';

export default function LoginScreen() {
  const { login, register, loading } = useAuth();
  const { tenant } = useTenant();
  const [school, setSchool] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [visible, setVisible] = useState(false);




  const handleLogin = async () => {
    console.log("Login event engage");

    if (!email || !password) {
      setTitle("Erreur");
      setBody("Veuillez remplir tous les champs: mail, mot de passe");
      setVisible(true);
      return;
    }

    try {
      setSubmitting(true);
      await login(email, password);

      router.replace('/dashboard');
    } catch (error: any) {
      console.log(error);
      setTitle("Erreur");
      setBody("Email ou mot de passe incorrect.");
      setVisible(true);
      // Alert.alert("Erreur", "Email ou mot de passe incorrect.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegister = async () => {
    console.log("Register event engage", "is visible: ", visible);
    if (!email || !password) {
      setTitle("Erreur");
      setBody("Veuillez remplir tous les champs: pseudo, mail, mot de passe");
      setVisible(true);
      return;
    }

    try {
      setSubmitting(true);
      await register(name, email, password);

      router.replace('/dashboard');
    } catch (error: any) {
      console.log(error);
      setTitle("Erreur");
      setBody("Email ou mot de passe incorrect.");
      setVisible(true);
      // Alert.alert("Erreur", "Email ou mot de passe incorrect.");
    } finally {
      setSubmitting(false);
    }

  }

  return (<>
    <LoginUI
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleLogin={handleLogin}
      handleRegister={handleRegister}
      loading={submitting}
      tenant={tenant}
      school={school}
      setSchool={setSchool}
      name={name}
      setName={setName}
    />
    <CustomModal
      modalTitle={title}
      bodyText={body}
      setVisible={setVisible}
      visible={visible} />
  </>
  );
}
