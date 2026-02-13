import { useState, useEffect, useCallback, useMemo } from 'react';
import {
	ScrollView,
	RefreshControl,
	View,
	ActivityIndicator,
} from 'react-native';

import Screen from '@/components/Screen';
import HomeHeader from '@/components/HomeHeader';
import FeaturedCarousel from '@/components/FeaturedCarousel';
import CategoryTabs from '@/components/CategoryTabs';
import { QuizCard } from '@/components/QuizCard';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'expo-router';
import { nestApi } from '@/api/nest';
import { getQuizzes } from '@/api/quiz';

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



	// 🔹 Fetch quizzes
	const loadQuizzes = async (pageNumber = 1, append = false) => {
		try {
			const data = await getQuizzes(pageNumber, 10);

			if (append) {
				setQuizzes(prev => [...prev, ...data]);
			} else {
				setQuizzes(data);
			}

			setHasMore(data.length > 0);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
			setLoadingMore(false);
		}
	};


	// 🔹 Initial load
	useEffect(() => {
		loadQuizzes(1);
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
				<View
					style={{
						flex: 1,
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<ActivityIndicator size="large" color={theme.primary} />
				</View>
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
				{filteredQuizzes.map((quiz) => (
					<View key={quiz.id} style={{ marginBottom: 18 }}>
						<QuizCard
							quiz={quiz}
							onPress={() => router.push(`/quiz/${quiz.id}`)}
						/>
					</View>
				))}

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
