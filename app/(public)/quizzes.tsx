import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { nestApi } from '../../api/nest';
import { QuizCard } from '../../components/QuizCard';
import { Quiz } from '../../types/quiz';
import Screen from '@/components/Screen';

export default function QuizzesScreen() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  useEffect(() => {
    nestApi.get<Quiz[]>('/quiz').then(res => {
      console.log(res.data);
      
      setQuizzes(res.data.filter(q => q.isPublished));
    });
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
            onPress={() => router.push(`/quiz/${item.id}`)}
          />
        )}
      />
    </Screen>
  );
}