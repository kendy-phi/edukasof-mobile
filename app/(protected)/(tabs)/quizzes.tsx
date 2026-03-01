import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  View,
} from 'react-native';

import CategoryTabs from '@/components/CategoryTabs';
import FeaturedCarousel from '@/components/FeaturedCarousel';
import HomeHeader from '@/components/HomeHeader';
import { QuizCard } from '@/components/QuizCard';
import Screen from '@/components/Screen';
import SkeletonCard from '@/components/SkeletonCard';
import SkeletonFeatured from '@/components/SkeletonFeatured';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { getAllQuizProgress } from '@/utils/quizProgress';
import { useRouter } from 'expo-router';


import { Quiz } from '@/types/quiz';

export default function HomeScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [continueQuiz, setContinueQuiz] = useState<any>(null);
  const [progressMap, setProgressMap] = useState<Record<string, any>>({});
  const { isAuthenticated } = useAuth();
  const { services } = useAuth();
  const [totalQuiz, setTotalQuiz] = useState(0);





  // 🔹 Fetch quizzes
  const loadQuizzes = async (pageNumber = 1, append = false) => {
    try {
      const response = await services?.quiz.load(pageNumber, 10);
      const newData = response.data;
      const total = response.total;

      if (append) {
        setQuizzes(prev => {
          const updatedList = [...prev, ...newData];
          // Mise à jour de hasMore basée sur la nouvelle longueur combinée
          setHasMore(updatedList.length < total);
          return updatedList;
        });
      } else {
        setQuizzes(newData);
        setTotalQuiz(total);
        // Si on est à la page 1, on compare juste la première salve au total
        setHasMore(newData.length < total);
        setPage(1); // Reset la page si ce n'est pas un append (ex: refresh)
      }

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };


  // 🔹 Initial load
  useEffect(() => {
    loadQuizzes(1);
  }, []);

  useEffect(() => {
    const loadProgress = async () => {
      const progress = await getAllQuizProgress();
      setProgressMap(progress);
    };

    loadProgress();
  }, []);


  const loadMore = async () => {
    if (!hasMore || loadingMore) return;

    setLoadingMore(true);

    const nextPage = page + 1;
    setPage(nextPage);

    await loadQuizzes(nextPage, true);
  }

  // 🔹 Pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadQuizzes();
    setRefreshing(false);
  }, []);

  // 🔹 Categories (memoized)
  const categories = useMemo(() => {
    const unique = [...new Set(quizzes.map(q => q.category))];
    return ['Tous', ...unique];
  }, [quizzes]);

  // 🔹 Filtered quizzes (memoized)
  const filteredQuizzes = useMemo(() => {
    if (selectedCategory === 'Tous') return quizzes;
    return quizzes.filter(q => q.category === selectedCategory);
  }, [selectedCategory, quizzes]);

  // 🔹 Loading state
  if (loading) {
    return (
      <Screen>
        <HomeHeader />
        <SkeletonFeatured />

        {[1, 2, 3, 4].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </Screen>
    );
  }


  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.primary} // iOS
            colors={[theme.primary]}  // Android
          />
        }
        onMomentumScrollEnd={(event) => {
          const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;

          const isEnd =
            layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;

          if (isEnd) {
            loadMore();
          }
        }}
      >
        {/* HEADER */}
        <HomeHeader />

        {/* FEATURED */}
        <FeaturedCarousel quizzes={quizzes.slice(0, 3)} />

        {/* CATEGORY FILTER */}
        <CategoryTabs
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />

        {/* QUIZ LIST */}
        {filteredQuizzes.map((quiz) => {
          const progress = progressMap[quiz.id];

          let progressPercentage = 0;

          if (progress && quiz.questionCount) {
            progressPercentage =
              (progress.currentIndex / quiz.questionCount) * 100;
          }

          return (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              progressPercentage={progressPercentage}
              onPress={() => {
                if (quiz.isPremium && !isAuthenticated)
                  router.push('/login');
                router.push(`/quiz/${quiz.id}`)
              }}
            />
          );
        })}



        {loadingMore && (
          <View style={{ paddingVertical: 20 }}>
            <ActivityIndicator size="small" color={theme.primary} />
          </View>
        )}

        {/* Bottom spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </Screen>
  );
}
