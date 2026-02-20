import {
  getQuizHistory,
  getQuizStats,
  getSchoolDashboard
} from '@/api/dashboard';
import { useAuth } from '@/context/AuthContext';
import { useTenant } from '@/context/TenantContext';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';

const C = {
  bg: '#ffffff',
  surface: '#f8fafc',
  border: '#e5e7eb',
  text: '#111827',
  muted: '#6b7280',
  accent: '#2563eb',
  success: '#16a34a',
};

export default function Dashboard() {
  const { tenant } = useTenant();
  const { user } = useAuth();

  const isFull = tenant?.type === "full";

  const [schoolData, setSchoolData] = useState<any>(null);
  const [quizStats, setQuizStats] = useState({ totalCompleted: 0, averageScore: 0, streak: 0, totalStudyMinutes: 0, bestScore: 0 });
  const [quizHistory, setQuizHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);

        if (isFull) {
          const school = await getSchoolDashboard();
          setSchoolData(school);
        }

        const stats = await getQuizStats();
        setQuizStats(stats);
        // console.log("Quiz statistic:", stats);


        const history = await getQuizHistory();
        setQuizHistory(history.slice(0, 3));

      } catch (error: any) {
        console.log("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={C.accent} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.greeting}>
          Bonjour, {user?.name || 'Étudiant'} 👋
        </Text>
        <Text style={styles.school}>
          {tenant?.type === "full" ? tenant.name : "Mode Quiz"}
        </Text>
      </View>

      {/* SCHOOL CARD */}
      {isFull && schoolData && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📚 Situation Académique</Text>

          <View style={styles.rowBetween}>
            <Text style={styles.label}>Classe</Text>
            <Text style={styles.value}>{schoolData.class}</Text>
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.label}>Moyenne</Text>
            <Text style={[styles.value, { color: C.success }]}>
              {schoolData.average}%
            </Text>
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.label}>Paiement</Text>
            <Text style={[styles.value, { color: C.success }]}>
              {schoolData.payment_status}
            </Text>
          </View>
        </View>
      )}

      {/* QUIZ CARD */}
      {quizStats && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🧠 Activité Quiz</Text>

          <View style={styles.rowBetween}>
            <Text style={styles.label}>Quiz complétés</Text>
            <Text style={styles.value}>{quizStats.totalCompleted || 0}</Text>
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.label}>Score moyen</Text>
            <Text style={styles.value}>{quizStats.averageScore}%</Text>
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.label}>Meilleur score</Text>
            <Text style={styles.value}>{quizStats.bestScore}%</Text>
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.label}>Temps passé</Text>
            <Text style={styles.value}>{quizStats.totalStudyMinutes}min</Text>
          </View>
        </View>
      )}

      {/* HISTORY */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📊 Derniers Quiz</Text>

        {quizHistory.map((item, index) => (


          <View key={index} style={styles.historyItem}>
            <View>
              <Text style={styles.label}>{item.quizId.title}</Text>
              <Text style={styles.value}>
                {Math.round((item.score / item.totalQuestions) * 100)}%
              </Text>
            </View>

            <Pressable
              style={styles.reviewButton}
              onPress={() => router.push(`/quiz-review/${item._id}`)}
            >
              <Text style={styles.reviewText}>Voir</Text>
            </Pressable>
          </View>
        ))}
      </View>
      {/* take quiz */}
      <View style={styles.actions}>
        <Pressable style={styles.primaryButton} onPress={() => { router.replace('/home') }}>
          <Text style={styles.primaryText}> Lister Quiz</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 0.2
  },

  reviewButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },

  reviewText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },

  header: {
    marginBottom: 24,
  },

  greeting: {
    fontSize: 22,
    fontWeight: '600',
    color: C.text,
  },

  school: {
    fontSize: 14,
    color: C.muted,
    marginTop: 4,
  },

  card: {
    backgroundColor: C.surface,
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: 20,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 14,
    color: C.text,
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  label: {
    fontSize: 14,
    color: C.muted,
  },

  value: {
    fontSize: 14,
    fontWeight: '600',
    color: C.text,
  },

  actions: {
    marginBottom: 20,
  },

  primaryButton: {
    backgroundColor: C.accent,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },

  primaryText: {
    color: '#fff',
    fontWeight: '600',
  },

  secondaryButton: {
    borderWidth: 1,
    borderColor: C.border,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  secondaryText: {
    color: C.text,
    fontWeight: '500',
  },

  historyRow: {
    paddingVertical: 8,
  },
});
