import LimitModal from '@/components/LimiModal';
import Screen from '@/components/Screen';
import { useAuth } from '@/context/AuthContext';
import { getGuestQuizCount } from '@/utils/guestLimit';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { Quiz } from '../../../types/quiz';


export default function QuizDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [reached, setReached] = useState(0);
  const { isAuthenticated, services } = useAuth();
  const [showLimitModal, setShowLimitModal] = useState(false);

  useEffect(() => {
    if (!id) return;

    const loadQuiz = async () => {
      try {
        const res = await services?.quiz?.description(id); //nestApi.get<Quiz>(`/quiz/${id}`);
        console.log(res);
        
        setQuiz(res);
      } catch (error) {
        console.log('Failed to load quiz', error);
      } finally {
        setLoading(false);
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
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!quiz) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Quiz not found</Text>
      </View>
    );
  }

  return (
    <Screen>
      <View style={{ flex: 1, padding: 20 }}>
        {/* Title */}
        <Text style={{ fontSize: 26, fontWeight: '800', marginBottom: 8 }}>
          {quiz.title}
        </Text>

        {/* Meta */}
        <Text style={{ color: '#64748b', marginBottom: 12 }}>
          {quiz.category} • {quiz.difficulty} • Grade {quiz.grade}
        </Text>

        {/* Description */}
        <Text style={{ fontSize: 16, lineHeight: 22, marginBottom: 20 }}>
          {quiz.description}
        </Text>

        {/* Stats */}
        <View
          style={{
            backgroundColor: '#f8fafc',
            borderRadius: 12,
            padding: 16,
            marginBottom: 24,
            gap: 8,
          }}
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
        {/* Start button */}
        <Pressable
          onPress={async () => {

            if (!isAuthenticated) {
              const balance = await getGuestQuizCount();
              setReached(balance);
              if (reached >= 3) {
                  setShowLimitModal(true);
                  console.log("Guest reached the limit");
                  return;
                } else {
                  console.log("Guest is free to play", reached);
                  // router.push(`/quiz/${quiz.id}/play`)
                }
            } 
            if (quiz.isPremium && !isAuthenticated) {
              router.push({
                pathname: '/login',
                params: {
                  message: "Connectez-vous pour continuer, vous n'avez plus d'essaie quiz gratuits."
                }
              });
            }
            try {
              const data = await services?.quiz?.startQuiz(id);
              console.log('save apptempt response: ', data);
              const params = { attemptId: data._id };
              router.push({
                pathname: `/quiz/${quiz.id}/play`,
                params: params
              });
            } catch (e: any) {
              console.log('error on Start quiz', e);

            }
            // next step: start quiz session
            // 

          }}
          style={{
            backgroundColor: '#2563eb',
            paddingVertical: 16,
            borderRadius: 14,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: 'white',
              fontSize: 18,
              fontWeight: '700',
            }}
          >
            Start Quiz
          </Text>
        </Pressable>
      </View>
    </Screen>
  );
}
