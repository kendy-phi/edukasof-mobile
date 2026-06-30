import React, { useEffect, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

import { useLeague } from '@/context/LeagueContext';
import { useAuth } from '@/context/AuthContext';

export default function LeagueWaitingRoomScreen() {
  const router = useRouter();
  const {
    participants,
    currentLeague,
    leagueStarted,
  } = useLeague();

  const { user } = useAuth();

  useEffect(() => {
    if (leagueStarted) {
      router.replace('/league/play');
    }
  }, [leagueStarted]);

  const playerCountLabel = useMemo(() => {
    const count = participants.length;
    if (count <= 1) return '1 joueur prêt';
    return `${count} joueurs prêts`;
  }, [participants.length]);

  // console.log(`participants `, participants);

  const renderParticipant = ({ item, index }: any) => {
    const isCurrentUser =
      item.userId === user?.id;

    const emoji =
      index === 0
        ? '👑'
        : index === 1
        ? '🎯'
        : index === 2
        ? '⚡'
        : '🎮';

    return (
      <View
        style={[
          styles.playerSlideCard,
          isCurrentUser && styles.playerSlideCardMe,
        ]}
      >
        <View
          style={[
            styles.slideAvatar,
            isCurrentUser && styles.slideAvatarMe,
          ]}
        >
          <Text style={styles.slideAvatarText}>
            {emoji}
          </Text>
        </View>

        <Text
          style={[
            styles.slidePlayerName,
            isCurrentUser && styles.slidePlayerNameMe,
          ]}
          numberOfLines={1}
        >
          {item.userName}
        </Text>

        <Text style={styles.slidePlayerSub}>
          {isCurrentUser ? 'Vous' : 'Joueur'}
        </Text>

        {isCurrentUser && (
          <View style={styles.slideMeBadge}>
            <Text style={styles.slideMeBadgeText}>
              VOUS
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <LinearGradient
      colors={[
        '#0F172A',
        '#111827',
        '#1E293B',
      ]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.heroCard}>
            <Text style={styles.heroIcon}>
              🏆
            </Text>

            <Text style={styles.heroLabel}>
              League Quiz
            </Text>

            <Text style={styles.title}>
              {currentLeague?.title ?? 'League'}
            </Text>

            <View style={styles.pinBadge}>
              <Text style={styles.pinLabel}>
                PIN
              </Text>
              <Text style={styles.pinValue}>
                {currentLeague?.sharePin ?? '------'}
              </Text>
            </View>
          </View>

          {/* Status */}
          <View style={styles.statusRow}>
            <View style={styles.statusCard}>
              <Text style={styles.statusNumber}>
                {participants.length}
              </Text>
              <Text style={styles.statusText}>
                Participants
              </Text>
            </View>

            <View style={styles.statusCard}>
              <Text style={styles.statusNumber}>
                READY
              </Text>
              <Text style={styles.statusText}>
                Statut
              </Text>
            </View>
          </View>

          {/* Lobby title */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Joueurs connectés ({participants.length})
            </Text>
            <Text style={styles.sectionSubtitle}>
              Faites glisser pour voir tous les participants
            </Text>
          </View>

          {/* Participants */}
          <FlatList
            data={participants}
            horizontal
            keyExtractor={item => item?.userId?.toString() ?? Date()}
            renderItem={renderParticipant}
            contentContainerStyle={styles.horizontalListContent}
            showsHorizontalScrollIndicator={false}
          />

          {/* Footer */}
          <View style={styles.footerCard}>
            <Text style={styles.footerTitle}>
              En attente du démarrage...
            </Text>
            <Text style={styles.footerText}>
              L'administrateur va lancer la partie.
              
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },

  safe: {
    flex: 1,
  },

  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 20,
  },

  heroCard: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 16,
  },

  heroIcon: {
    fontSize: 42,
    marginBottom: 8,
  },

  heroLabel: {
    color: '#93C5FD',
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 16,
  },

  pinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  pinLabel: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  pinValue: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 2,
  },

  statusRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18,
  },

  statusCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },

  statusNumber: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },

  statusText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },

  sectionHeader: {
    marginBottom: 12,
  },

  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },

  sectionSubtitle: {
    color: '#94A3B8',
    fontSize: 14,
    marginTop: 4,
  },

  horizontalListContent: {
    paddingBottom: 16,
    paddingRight: 12,
  },

  playerSlideCard: {
    width: 140,
    minHeight: 170,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 14,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  playerSlideCardMe: {
    backgroundColor: 'rgba(37,99,235,0.18)',
    borderColor: 'rgba(96,165,250,0.35)',
  },

  slideAvatar: {
    width: 62,
    height: 62,
    borderRadius: 999,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  slideAvatarMe: {
    backgroundColor: '#2563EB',
  },

  slideAvatarText: {
    fontSize: 28,
  },

  slidePlayerName: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'center',
  },

  slidePlayerNameMe: {
    color: '#FFFFFF',
  },

  slidePlayerSub: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 6,
    textAlign: 'center',
  },

  slideMeBadge: {
    marginTop: 12,
    backgroundColor: '#2563EB',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },

  slideMeBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  footerCard: {
    marginTop: 'auto',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },

  footerTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
    textAlign: 'center',
  },

  footerText: {
    color: '#CBD5E1',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});