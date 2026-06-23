import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import {
  useLeague,
} from '@/context/LeagueContext';

export default function PlayScreen() {

  const {
    currentQuestion,
  } = useLeague();

  return (

    <View style={styles.container}>

      <Text style={styles.title}>
        Quiz en cours
      </Text>

      <Text style={styles.question}>

        {
          currentQuestion?.questionText ??
          'Aucune question'
        }

      </Text>

    </View>

  );

}

const styles =
  StyleSheet.create({

    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
    },

    title: {
      fontSize: 24,
      fontWeight: '700',
      marginBottom: 20,
    },

    question: {
      fontSize: 18,
    },

  });