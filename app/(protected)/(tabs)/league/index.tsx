import React, {
  useState,
  useEffect
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

export enum LeagueStatus  {
  OPEN ='open',
  CLOSED = 'close',
  STARTED = 'started'
};

export default function JoinLeagueScreen() {

  const router =
    useRouter();

  const {
    joinLeague,
    currentLeague,
    setCurrentLeague,
    ensureConnected,
    isSocketConnected,
    lastPlayerJoined
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

  useEffect(() => {
    ensureConnected();
  }, []);

  useEffect(() => {
    console.log(
      '➡️ [LeagueIndex] lastPlayerJoined =',
      lastPlayerJoined,
      '| user.id =',
      user?.id,
    );

    if (!user?.id || !lastPlayerJoined) {
      return;
    }

    if (lastPlayerJoined === user.id) {
      console.log('🚪 [LeagueIndex] redirect to waiting');
      if(currentLeague !== null && currentLeague.status === LeagueStatus.STARTED)
        router.replace('/league/play');
      router.replace('/league/waiting');
    }
    
  }, [lastPlayerJoined, user?.id]);

  const handleJoin = async () => {
    try {
      if (code.trim().length < 6) {
        Alert.alert(
          'Code invalide',
          'Veuillez saisir un code valide.',
        );
        return;
      }

      setLoading(true);
      ensureConnected();

      const result =
        await services?.league?.joinWithSharePin(code.trim());

      console.log(
        'league joined by token =>',
        result?._id,
        'socket connected =>',
        isSocketConnected,
      );

      if (!user || !result?._id) {
        Alert.alert(
          'Erreur',
          'Impossible de rejoindre la ligue.',
        );
        return;
      }

      setCurrentLeague(result);

      joinLeague(
        result._id,
        result.userId,
        user.name,
      );
    } catch (error) {
      console.log('when join league failed =>', error);

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