import LimitModal from '@/components/LimiModal';
import CustomModal from '@/components/ModalUI';
import Screen from '@/components/Screen';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { getGuestQuizCount } from '@/utils/guestLimit';
import { handleStartQuiz } from '@/utils/quiz/startQuiz';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Quiz } from '../../../types/quiz';
// import socketService from '@/service/SocketService';

export default function QuizDetailScreen() {
  const { id, message } = useLocalSearchParams<{ id: string, message:string }>();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [click, setClick] = useState(false);
  const [reached, setReached] = useState(0);
  const { isAuthenticated, services } = useAuth();
  const [showLimitModal, setShowLimitModal] = useState(false);
  const { theme } = useTheme();
  const styles = _styles_(theme, click);

  useEffect(() => {
    if (!id) return;

    const loadQuiz = async () => {
      try {
        const res = await services?.quiz?.description(id); //nestApi.get<Quiz>(`/quiz/${id}`);
        console.log(`load quiz: ==>`,res.title);
        setQuiz(res);
      } catch (error) {
        console.log('Failed to load quiz', error);
      } finally {
        setLoading(false);
        if(message?.length > 0)
          setVisible(true)
      }
    };

    loadQuiz();
  }, [id]);

  useEffect(() => {
    const loadLimit = async () => {
      const limit = await getGuestQuizCount();
      setReached(limit);
    }
    loadLimit();
  }, [])

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!quiz) {
    return (
      <View style={styles.blankContainer}>
        <Text>Quiz not found</Text>
      </View>
    );
  }

  return (
    <Screen>
      <View style={styles.container}>
        {/* Title */}
        <Text style={styles.quizTitle}>
          {quiz.title}
        </Text>

        {/* Meta */}
        <Text style={styles.quizCategory}>
          {quiz.category} • {quiz.difficulty} • Grade {quiz.grade}
        </Text>

        {/* Description */}
        <Text style={styles.quizDescription}>
          {quiz.description}
        </Text>

        {/* Stats */}
        <View
          style={styles.cardBody}
        >
          <Text>⏱️ Duration: {quiz.duration} minutes</Text>
          <Text>🎯 Passing score: {quiz.passingScore}%</Text>
          <Text>🏆 Total score: {quiz.totalScore}</Text>
          <Text>{!isAuthenticated ? `Number of reached ${reached}` : ''}</Text>
        </View>
        <LimitModal
          visible={showLimitModal}
          onClose={() => { setShowLimitModal(false) }}
        />
        <CustomModal visible={visible} setVisible={setVisible} modalTitle={quiz.title} bodyText={message} />
        {/* Start button */}
        <Pressable
          onPress={() =>
            handleStartQuiz({
              isAuthenticated,
              quiz,
              id,
              router,
              services,
              setClick,
              setReached,
              setShowLimitModal,
            })
          }
          disabled={click}
          style={({ pressed }) => [
            styles.startBtn,
            pressed && styles.buttonPressed,
            click && styles.buttonDisabled,
          ]}
        >
          <Text style={styles.startBtnText}>
            🚀 Start Quiz
          </Text>
        </Pressable>

        {/* Login button */}
        {!isAuthenticated && (
          <Pressable
            onPress={() => router.push('/login')}
            style={({ pressed }) => [
              styles.loginBtn,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.loginBtnText}>
              🔐 Se connecter
            </Text>
          </Pressable>
        )}

      </View>
    </Screen>
  );
}

const _styles_ = (C: any, loading: boolean) =>
  StyleSheet.create({
    loader:{ flex: 1, justifyContent: 'center' },
    blankContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    container: { flex: 1, padding: 20 },
    quizTitle: { fontSize: 26, fontWeight: '800', marginBottom: 8, color: C.text },
    quizCategory: { color: '#64748b', marginBottom: 12 },
    quizDescription: { fontSize: 16, lineHeight: 22, marginBottom: 20, color: C.text },
    cardBody: { backgroundColor: '#f8fafc', borderRadius: 12, padding: 16, marginBottom: 24, gap: 8 },
    startBtn: { backgroundColor: C.primary, paddingVertical: 18, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 6}, shadowOpacity: 0.18, shadowRadius: 8, elevation: 8}, 
    loginBtn: { backgroundColor: '#ffffff', paddingVertical: 18, borderRadius: 18, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: C.primary, shadowColor: '#000', shadowOffset: { width: 0, height: 4}, shadowOpacity: 0.08, shadowRadius: 6, elevation: 4}, 
    startBtnText: { color: '#fff', fontSize: 17, fontWeight: '700', letterSpacing: 0.5}, loginBtnText: { color: C.primary, fontSize: 17, fontWeight: '700', letterSpacing: 0.5}, buttonPressed: { transform: [{ scale: 0.98 }], opacity: 0.9}, 
    buttonDisabled: { backgroundColor: '#94a3b8'}
  });