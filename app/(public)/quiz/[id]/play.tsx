import Screen from '@/components/Screen';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { incrementGuestQuizCount, getGuestQuizCount } from '@/utils/guestLimit';
import {
    clearQuizProgress,
    getQuizProgress,
    saveQuizProgress,
} from '@/utils/quiz/quizProgress';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Pressable,
    Text,
    View
} from 'react-native';

import ProgressBar from '@/components/ProgressBar';
import QuestionCard from '@/components/QuestionCard';
import { Question } from '@/types/question';
import { formatTime } from '@/utils/quiz/startQuiz';

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
    const [submitting, setSubmitting] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

    const [timeLeft, setTimeLeft] = useState(0);
    const toggleOption = (option: string) => {
        if (selectedOptions.includes(option)) {
            setSelectedOptions(selectedOptions.filter(o => o !== option));
        } else {
            setSelectedOptions([...selectedOptions, option]);
        }
    };

    /*
    =========================
    Load Quiz
    =========================
    */

    useEffect(() => {
        if (!id || !services?.quiz) return;

        const loadQuiz = async () => {
            try {
                console.log(`Load quiz question: `, id);
                const quiz = await services.quiz.loadQuizWithQuestion(id);
                setTimeLeft(quiz.duration * 60);

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
    Timer and text
    =========================
    */
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if(!loading){
            if (timeLeft <= 0) {
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                }
    
                handleTimeUp(); // 🔥 logique métier ici
                return;
            }
    
            intervalRef.current = setInterval(() => {
                setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
            }, 1000);
    
            return () => {
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                }
            };
        }
    }, [timeLeft]);

    const handleTimeUp = async () => {
        const isCompleted = Object.keys(answers).length === questions.length && questions.length > 0;

        console.log(`time is up is completed: ${isCompleted}`, `answers length: ==> `,Object.keys(answers).length, `Question length ==> `,questions.length);            
        
        return submitAnswers(answers, "handleTimeUp");
    };

    /*
    =========================
    Recover Progress
    =========================
    */

    useEffect(() => {
        if (!id || questions.length === 0) return;

        const recover = async () => {
            const progress = await getQuizProgress(id);

            if (!progress || progress.quizId !== id) return;

            // 🔥 Quiz déjà terminé mais pas encore soumis
            if (progress.currentIndex >= questions.length) {
                console.log("Quiz completed previously, submitting...");
                submitAnswers(progress.answers, "recover");
                return;
            }

            setCurrentIndex(progress.currentIndex);
            setAnswers(progress.answers);
            setTimeLeft(progress.time == 0 ? timeLeft : progress.time)

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

    const submitAnswers = async (finalAnswers: Record<string, string[]>, method: string) => {
        console.log('Called by:', method);
        console.log(`Submit quiz answers: `, services?.quiz, submitting, finalAnswers);
        if (!services?.quiz || submitting || Object.keys(finalAnswers).length != questions.length) return;
        setSubmitting(true)
        try {
            const payload = {
                attemptId,
                wasTimeout: timeLeft == 0,
                answers: Object.keys(finalAnswers).map((key) => ({
                    key,
                    value: finalAnswers[key],
                })),
            };

            console.log(`payload to send for quiz validation: `, payload);

            const data = await services.quiz.validate(payload, id, isAuthenticated);
            // console.log(`Quiz validate response: `, data);

            if (!isAuthenticated) {
                await incrementGuestQuizCount();
                console.log(`not auth imcreament guest question count: `, getGuestQuizCount());
            }

            if (data) {
                router.replace({
                    pathname: `/quiz/[id]/result`,
                    params: {
                        id: id,
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
        const question = questions[currentIndex];

        let answerValues: string[] = [];

        if (question.type === 'MULTI_SELECT') {
            if (selectedOptions.length === 0) return;
            answerValues = selectedOptions;
        } else {
            if (!selected) return;
            if (question.type == 'TRUE_FALSE')
                answerValues = [selected == 'True' ? 'Vrai' : 'Faux']
            else
                answerValues = [selected];
        }

        const isLast = currentIndex === questions.length - 1;

        const newAnswers = {
            ...answers,
            [question._id]: answerValues,
        };

        setAnswers(newAnswers);

        await saveQuizProgress({
            quizId: id,
            currentIndex: currentIndex + 1,
            answers: newAnswers,
            time: timeLeft
        });

        console.log(`is last: `, isLast);

        if (isLast) {
            submitAnswers(newAnswers, "handleNext");
            clearQuizProgress(id);
            return;
        }

        setCurrentIndex((prev) => prev + 1);
        setSelected(null);
        setSelectedOptions([]);
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
    if (!question) return;

    const isLast = currentIndex === questions.length - 1;

    /*
    =========================
    UI
    =========================
    */
    // console.log(`Question: `, question)
    const total = questions.length;
    const progress = total > 0 ? (currentIndex + 1) / total : 0;
    return (
        <Screen>
            <View style={{ flex: 1, padding: 20 }}>
                {/* Progress Header */}
                <View style={{ marginBottom: 20 }}>
                    <Text
                        style={{
                            color: theme.text,
                            marginBottom: 8,
                            fontWeight: '700',
                        }}
                    >
                        Question {currentIndex + 1} / {total}
                    </Text>
                    <ProgressBar progress={progress} theme={theme} />
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginBottom: 10,
                        }}
                    >
                        <Text style={{ color: theme.text }}>
                            Temps restant
                        </Text>

                        <Text
                            style={{
                                color: timeLeft < 60 ? 'red' : theme.text,
                                fontWeight: 'bold',
                            }}
                        >
                            {formatTime(timeLeft)}
                        </Text>
                    </View>

                </View>

                {/* Question */}
                <QuestionCard
                    question={question}
                    selected={selected}
                    selectedOptions={selectedOptions}
                    setSelected={setSelected}
                    setSelectedOptions={setSelectedOptions}
                    theme={theme}
                />
                <View style={
                    {
                        marginTop: 10
                    }
                }>
                    <Text style={{ color: theme.text, fontSize: 12, marginTop: 4 }}>
                        {Math.round(progress * 100)}% complété
                    </Text>
                </View>
                {/* NEXT BUTTON */}
                <Pressable
                    disabled={
                        question.type === 'MULTI_SELECT'
                            ? selectedOptions.length == 0
                            : !selected
                    }
                    onPress={handleNext}
                    style={{
                        marginTop: 'auto',
                        backgroundColor: selected || selectedOptions.length > 0 ? theme.primary : '#94a3b8',
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