import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { nestApi } from '../../api/nest';
import { QuizCard } from '../../components/QuizCard';
import { Quiz } from '../../types/quiz';

export default function QuizzesScreen() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  useEffect(() => {
    nestApi.get<Quiz[]>('/quiz').then(res => {
      setQuizzes(res.data.filter(q => !q.isPublished));
    });
  }, []);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={quizzes}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ gap: 12 }}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <QuizCard
            quiz={item}
            onPress={() => router.push(`/quiz/${item.id}`)}
          />
        )}
      />
    </View>
  );
}