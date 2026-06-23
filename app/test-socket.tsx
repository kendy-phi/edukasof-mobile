import React from 'react';
import {
  Button,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { useLeague } from '@/context/LeagueContext';
import socketService from '../service/SocketService';
import { ENV } from '@/config/env';

export default function TestSocketScreen() {
    let compteur = 1;

  const {
    participants,
    joinLeague,
  } = useLeague();

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 20,
        marginTop: 50
      }}
    >

        <Button
  title="Connect Socket"
  onPress={() => {

    socketService.connect(
      ENV.WEBSOCKET_URL
    );

  }}
/>

      <Button
        title="Join League"
        
        onPress={() => {
          console.log(`join league with ${compteur}`)
          joinLeague(
            '6a2f113b3ba872df76393310',
            '01KMGNZQ173CE8YFJ3PQHQEA1S',
            'ACCOUNT TEST',
          );
          compteur++;
        }}
      />

      <Text
        style={{
          marginTop: 20,
          fontSize: 18,
          fontWeight: 'bold',
        }}
      >
        Participants
      </Text>

      {
        participants.map(
          participant => (

            <View
              key={
                participant.userId
              }
            >

              <Text>
                {
                  participant.userName
                }
              </Text>

            </View>
          )
        )
      }

    </ScrollView>
  );
}