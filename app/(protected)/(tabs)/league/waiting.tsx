import React, {
  useEffect,
} from 'react';

import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from 'react-native';

import {
  useRouter,
} from 'expo-router';

import {
  useLeague,
} from '@/context/LeagueContext';

export default function LeagueWaitingRoomScreen() {

  const router =
    useRouter();

  const {
    participants,
    currentLeague,
    leagueStarted,
  } = useLeague();

  useEffect(() => {

    if (
      leagueStarted
    ) {

        
    }
    router.replace(
      '/league/play',
    );

  }, [
    leagueStarted,
  ]);

  return (

    <View
      style={
        styles.container
      }
    >

      <Text
        style={
          styles.title
        }
      >
        {
          currentLeague?.title ??
          'League'
        }
      </Text>

      <Text
        style={
          styles.code
        }
      >
        Code :
        {' '}
        {
          currentLeague?.shareCode
        }
      </Text>

      <Text
        style={
          styles.count
        }
      >
        Participants :
        {' '}
        {
          participants.length
        }
      </Text>

      <FlatList
        data={
          participants
        }
        keyExtractor={
          item =>
            item.userId
        }
        renderItem={({
          item,
        }) => (

          <View
            style={
              styles.player
            }
          >

            <Text>
              {
                item.userName
              }
            </Text>

          </View>

        )}
      />

      <Text
        style={
          styles.waiting
        }
      >
        En attente du démarrage...
      </Text>

    </View>

  );
}

const styles =
  StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
  },

  code: {
    marginTop: 10,
    fontSize: 16,
  },

  count: {
    marginTop: 20,
    marginBottom: 20,
    fontSize: 18,
  },

  player: {
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  waiting: {
    marginTop: 20,
    textAlign: 'center',
  },

});