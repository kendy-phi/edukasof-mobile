import Screen from '@/components/Screen';
import HomeHeader from '@/components/HomeHeader';
import FaeturedCarousel from '@/components/FeaturedCarousel';
import { useEffect, useState } from 'react';
import { QuizPreview } from '@/types/quiz';
import { nestApi } from '@/api/nest';

export default function HomeScreen() {
const [quizzes, setQuizzes] = useState<QuizPreview[]>([]);

  useEffect(() => {
    nestApi.get<QuizPreview[]>('/quiz').then(res => {
      setQuizzes(res.data);
    });
  }, []);
  return (
    <Screen>
      <HomeHeader />

      <FaeturedCarousel quizzes={quizzes} />
      {/* next: CategoryTabs */}
      {/* next: Quiz list */}
    </Screen>
  );
}
