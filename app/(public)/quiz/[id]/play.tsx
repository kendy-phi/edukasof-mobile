import Screen from '@/components/Screen';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { incrementGuestQuizCount } from '@/utils/guestLimit';
import {
    clearQuizProgress,
    getQuizProgress,
    saveQuizProgress,
} from '@/utils/quizProgress';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Pressable,
    Text,
    TextInput,
    View,
} from 'react-native';

import { Answer } from '@/types/question';

type Question = {
    _id: string;
    type: 'MCQ' | 'TRUE_FALSE' | 'SHORT_ANSWER' | 'MULTI_SELECT';
    questionText: string;
    options?: string[];
};

export default function PlayQuizScreen() {
    const { id, attemptId } = useLocalSearchParams<{ id: string; attemptId: string }>();
    const router = useRouter();
    const { theme } = useTheme();
    const { isAuthenticated, services } = useAuth();

    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selected, setSelected] = useState<string | null>(null);
    const [answers, setAnswers] = useState<Record<string, string[]>>({});
    const [bulkAnswers, setBulkAnswers] = useState<Answer[]>([]);
    const [submitting, setSubmitting] = useState(false);

    /*
    =========================
    Load Quiz
    =========================
    */

    useEffect(() => {
        if (!id || !services?.quiz) return;

        const loadQuiz = async () => {
            try {
                console.log(`Load quiz question: `,id);
                const quiz = await services.quiz.loadQuizWithQuestion(id);

                if (!quiz) return;

                if (quiz.isPremium && !isAuthenticated) {
                    router.replace({
                        pathname: '/login',
                        params: {
                            message: '🔒 Ce quiz est premium. Connectez-vous pour continuer.',
                        },
                    });
                    return;
                }

                const sorted = quiz.questions.sort(
                    (a: any, b: any) => a.order - b.order
                );

                setQuestions(sorted);
            } catch (error) {
                console.log('Error loading quiz:', error);
            } finally {
                setLoading(false);
            }
        };

        loadQuiz();
    }, [id, services, isAuthenticated]);

    /*
    =========================
    Recover Progress
    =========================
    */

    useEffect(() => {
        if (!id || questions.length === 0) return;

        const recover = async () => {
            const progress = await getQuizProgress(id);
            console.log(`Recover quiz answers: `,progress);

            if (!progress || progress.quizId !== id) return;

            // 🔥 Quiz déjà terminé mais pas encore soumis
            if (progress.currentIndex >= questions.length) {
                console.log("Quiz completed previously, submitting...");
                submitAnswers(progress.answers);
                return;
            }

            setCurrentIndex(progress.currentIndex);
            setAnswers(progress.answers);

            const q = questions[progress.currentIndex];

            if (q && progress.answers[q._id]) {
                setSelected(progress.answers[q._id][0]);
            }
        };

        recover();
    }, [id, questions]);

    /*
    =========================
    Submit answers
    =========================
    */

    const submitAnswers = async (finalAnswers: Record<string, string[]>) => {
        if (!services?.quiz || submitting) return;
        console.log(`Submit quiz answers: `,finalAnswers);
        setSubmitting(true)
        try {
            const payload = {
                attemptId,
                answers: Object.keys(finalAnswers).map((key) => ({
                    key,
                    value: finalAnswers[key],
                })),
            };

            const data = await services.quiz.validate(payload, id, isAuthenticated);
            console.log(`Quiz validate response: `,data);
            
            if (!isAuthenticated) {
                await incrementGuestQuizCount();
            }

            if (data) {
                router.replace({
                    pathname: `/quiz/${id}/result`,
                    params: {
                        score: data.score.toString(),
                        total: data.totalPoints.toString(),
                        percentage: data.percentage.toFixed(0),
                    },
                });
            }

            await clearQuizProgress(id);
        } catch (error: any) {
            console.log('❌ Server error:', error?.response?.data || error);
        }
    };

    /*
    =========================
    Next Question
    =========================
    */

    const handleNext = async () => {
        if (!selected) return;

        const question = questions[currentIndex];
        const isLast = currentIndex === questions.length - 1;

        const newAnswers = {
            ...answers,
            [question._id]: [selected],
        };

        setAnswers(newAnswers);

        await saveQuizProgress({
            quizId: id,
            currentIndex: currentIndex + 1,
            answers: newAnswers,
        });

        if (isLast) {
            submitAnswers(newAnswers);
            clearQuizProgress(id);
            return;
        }

        setCurrentIndex((prev) => prev + 1);
        setSelected(null);
    };

    /*
    =========================
    Loading
    =========================
    */

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <ActivityIndicator size="large" color={theme.primary} />
            </View>
        );
    }

    const question = questions[currentIndex];
    if (!question) return ;

    const isLast = currentIndex === questions.length - 1;

    /*
    =========================
    UI
    =========================
    */

    return (
        <Screen>
            <View style={{ flex: 1, padding: 20 }}>
                <Text
                    style={{
                        fontSize: 20,
                        fontWeight: '700',
                        marginBottom: 20,
                        color: theme.text,
                    }}
                >
                    {question.questionText}
                </Text>

                {/* MCQ */}
                {question.type === 'MCQ' &&
                    question?.options?.map((option) => (
                        <Pressable
                            key={option}
                            onPress={() => setSelected(option)}
                            style={{
                                padding: 14,
                                borderRadius: 12,
                                marginBottom: 10,
                                backgroundColor:
                                    selected === option ? theme.primary : theme.card,
                            }}
                        >
                            <Text
                                style={{
                                    color: selected === option ? 'white' : theme.text,
                                }}
                            >
                                {option}
                            </Text>
                        </Pressable>
                    ))}

                {/* TRUE/FALSE */}
                {question.type === 'TRUE_FALSE' &&
                    ['True', 'False'].map((option) => (
                        <Pressable
                            key={option}
                            onPress={() => setSelected(option)}
                            style={{
                                padding: 14,
                                borderRadius: 12,
                                marginBottom: 10,
                                backgroundColor:
                                    selected === option ? theme.primary : theme.card,
                            }}
                        >
                            <Text
                                style={{
                                    color: selected === option ? 'white' : theme.text,
                                }}
                            >
                                {option === 'True' ? 'VRAI' : 'FAUX'}
                            </Text>
                        </Pressable>
                    ))}

                {/* SHORT ANSWER */}
                {question.type === 'SHORT_ANSWER' && (
                    <TextInput
                        value={selected ?? ''}
                        onChangeText={setSelected}
                        placeholder="Votre réponse..."
                        placeholderTextColor={theme.text}
                        style={{
                            borderWidth: 1,
                            borderColor: theme.border,
                            borderRadius: 12,
                            padding: 14,
                            color: theme.text
                        }}
                    />
                )}

                {/* NEXT BUTTON */}
                <Pressable
                    disabled={!selected}
                    onPress={handleNext}
                    style={{
                        marginTop: 'auto',
                        backgroundColor: selected ? theme.primary : '#94a3b8',
                        paddingVertical: 16,
                        borderRadius: 14,
                        alignItems: 'center',
                    }}
                >
                    <Text style={{ color: 'white', fontSize: 18 }}>
                        {isLast ? 'Terminer' : 'Suivant'}
                    </Text>
                </Pressable>
            </View>
        </Screen>
    );
}