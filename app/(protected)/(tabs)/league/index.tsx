import React, {
  useState,
} from 'react';

import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  useRouter,
} from 'expo-router';

import {
  useLeague,
} from '@/context/LeagueContext';

import {
  useAuth,
} from '@/context/AuthContext';

export default function JoinLeagueScreen() {

  const router =
    useRouter();

  const {
    joinLeague,
  } = useLeague();

  const {
    services, user
  } = useAuth();

  const [
    code,
    setCode,
  ] = useState('');

  const [
    loading,
    setLoading,
  ] = useState(false);

  const handleJoin =
    async () => {

      try {

        if (
          code.trim().length < 6
        ) {

          Alert.alert(
            'Code invalide',
            'Veuillez saisir un code valide.'
          );

          return;
        }

        try{
          setLoading(true);
          const result = await services?.league.joinWithSharePin(code); 
          if(user && result){
            joinLeague(result._id, user?.id, user?.name);
            router.replace('/(protected)/(tabs)/league/waiting');
          }else{
            Alert.alert(
              'Erreur',
              'Impossible de rejoindre la ligue.',
            );
          }          
        }catch(error){
          console.log(`when join league failed: `, error)
        }
        
      } catch (error) {

        Alert.alert(
          'Erreur',
          'Impossible de rejoindre la ligue.',
        );

      } finally {

        setLoading(false);

      }
    };

  return (

    <View
      style={
        styles.container
      }
    >

      <Text
        style={
          styles.icon
        }
      >
        🏆
      </Text>

      <Text
        style={
          styles.title
        }
      >
        Rejoindre une ligue...
      </Text>

      <Text
        style={
          styles.subtitle
        }
      >
        Entrez le code
        partagé par
        l'organisateur.
      </Text>

      <TextInput
        value={code}
        autoCapitalize="characters"
        onChangeText={value =>
          setCode(
            value.toUpperCase(),
          )
        }
        maxLength={6}
        placeholder="A7K9P2"
        style={
          styles.input
        }
      />

      <TouchableOpacity
        style={
          styles.button
        }
        onPress={
          handleJoin
        }
        disabled={
          loading
        }
      >

        {
          loading
          ? (
            <ActivityIndicator
              color="#fff"
            />
          )
          : (
            <Text
              style={
                styles.buttonText
              }
            >
              Rejoindre
            </Text>
          )
        }

      </TouchableOpacity>

    </View>

  );
}

const styles =
  StyleSheet.create({

  container: {
    flex: 1,
    padding: 24,
    justifyContent:
      'center',
    backgroundColor:
      '#F8FAFC',
  },

  icon: {
    fontSize: 60,
    textAlign:
      'center',
    marginBottom: 20,
  },

  title: {
    fontSize: 28,
    fontWeight:
      '700',
    textAlign:
      'center',
  },

  subtitle: {
    marginTop: 10,
    marginBottom: 30,
    textAlign:
      'center',
    color:
      '#64748B',
  },

  input: {
    height: 60,
    borderWidth: 1,
    borderColor:
      '#CBD5E1',
    borderRadius: 12,
    backgroundColor:
      '#FFF',
    textAlign:
      'center',
    fontSize: 24,
    fontWeight:
      '700',
    letterSpacing: 4,
  },

  button: {
    marginTop: 20,
    height: 55,
    borderRadius: 12,
    justifyContent:
      'center',
    alignItems:
      'center',
    backgroundColor:
      '#2563EB',
  },

  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight:
      '600',
  },

});