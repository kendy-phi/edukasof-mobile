import Screen from '@/components/Screen';
import { getAllQuizProgress } from '@/utils/quizProgress';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { nestApi } from '../../api/nest';
import { QuizCard } from '../../components/QuizCard';
import { Quiz } from '../../types/quiz';
export default function QuizzesScreen() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [quizProgressMap, setQuizProgressMap] = useState<Record<string, number>>({});


  useEffect(() => {
    nestApi.get<Quiz[]>('/quiz').then(res => {
      console.log(res.data);

      setQuizzes(res.data.filter(q => q.isPublished));
    });
  }, []);

  useEffect(() => {
    const loadProgress = async () => {
      const saved = await getAllQuizProgress();

      if (!saved) {
        setQuizProgressMap({});
        return;
      }

      setQuizProgressMap(JSON.parse(saved));
    };

    loadProgress();
  }, []);


  return (
    <Screen>
      <FlatList
        data={quizzes}
        contentContainerStyle={{ gap: 12 }}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <QuizCard
            quiz={item}
            progressPercentage={quizProgressMap[item.id] ?? 0}
            onPress={() => router.push(`/quiz/${item.id}`)}
          />
        )}
      />
    </Screen>
  );
}