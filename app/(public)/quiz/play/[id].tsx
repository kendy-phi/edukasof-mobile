import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Pressable,
    Text,
    TextInput,
    View,
} from 'react-native';

import { Quiz } from '@/types/quiz';
import { getUserState } from '@/utils/session';
import { useNavigation } from 'expo-router';
import { BackHandler } from 'react-native';
import { nestApi } from '../../../../api/nest';
import { Question } from '../../../../types/question';


export default function PlayQuizScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();

    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selected, setSelected] = useState<string | null>(null);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);

    const navigation = useNavigation();

    useEffect(() => {
        // Disable header back
        navigation.setOptions({
            headerShown: false,
            gestureEnabled: false, // iOS swipe back
        });

        // Disable Android hardware back
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            () => false // prevent default behavior
        );

        return () => backHandler.remove();
    }, []);


    useEffect(() => {
        if (!id) return;

        nestApi
            .get<Quiz>(`/quiz/loadQuestion/${id}`)
            .then(res => {
                const sorted =
                    res?.data?.questions?.sort((a, b) => a.order - b.order) || [];
                setQuestions(sorted);
            })
            .catch(err => {
                console.error('Failed to load questions', err);
            })
            .finally(() => setLoading(false));
    }, [id]);

    const saveAnswer = async (
        questionId: string,
        answer: string
    ) => {
        const { isAuthenticated } = getUserState();

        if (isAuthenticated) {
            // 🔐 Logged-in user → send to server
            try {
                await nestApi.post('/quiz/answer', {
                    quizId: id,
                    questionId,
                    answer,
                });
            } catch (err) {
                console.error('Failed to save answer remotely', err);
            }
        } else {
            // 👤 Guest → save locally
            setAnswers(prev => ({
                ...prev,
                [questionId]: answer,
            }));
        }
    };


    // Reset selection when question changes
    useEffect(() => {
        setSelected(null);
    }, [currentIndex]);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    const question = questions[currentIndex];

    if (!question) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Text>No questions found</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, padding: 20 }}>
            {/* Progress */}
            <Text style={{ color: '#64748b', marginBottom: 8 }}>
                Question {currentIndex + 1} / {questions.length}
            </Text>

            {/* Question */}
            <Text
                style={{
                    fontSize: 22,
                    fontWeight: '700',
                    marginBottom: 20,
                }}
            >
                {question.questionText}
            </Text>

            {/* ================= ANSWER AREA ================= */}

            {/* MCQ */}
            {question.type === 'MCQ' &&
                question.options?.map(option => {
                    const isSelected = selected === option;

                    return (
                        <Pressable
                            key={option}
                            onPress={() => setSelected(option)}
                            style={{
                                padding: 16,
                                borderRadius: 12,
                                marginBottom: 12,
                                backgroundColor: isSelected ? '#2563eb' : '#f1f5f9',
                                borderWidth: 1,
                                borderColor: isSelected ? '#2563eb' : '#e2e8f0',
                            }}
                        >
                            <Text
                                style={{
                                    color: isSelected ? 'white' : '#0f172a',
                                    fontSize: 16,
                                }}
                            >
                                {option}
                            </Text>
                        </Pressable>
                    );
                })}

            {/* TRUE / FALSE */}
            {question.type === 'TRUE_FALSE' &&
                ['True', 'False'].map(option => {
                    const isSelected = selected === option;

                    return (
                        <Pressable
                            key={option}
                            onPress={() => setSelected(option)}
                            style={{
                                padding: 16,
                                borderRadius: 12,
                                marginBottom: 12,
                                backgroundColor: isSelected ? '#16a34a' : '#f1f5f9',
                                borderWidth: 1,
                                borderColor: isSelected ? '#16a34a' : '#e2e8f0',
                            }}
                        >
                            <Text
                                style={{
                                    color: isSelected ? 'white' : '#0f172a',
                                    fontSize: 16,
                                }}
                            >
                                {option}
                            </Text>
                        </Pressable>
                    );
                })}

            {/* SHORT ANSWER */}
            {question.type === 'SHORT_ANSWER' && (
                <TextInput
                    placeholder="Type your answer..."
                    value={selected ?? ''}
                    onChangeText={setSelected}
                    style={{
                        borderWidth: 1,
                        borderColor: '#cbd5f5',
                        borderRadius: 12,
                        padding: 14,
                        fontSize: 16,
                    }}
                />
            )}

            {/* ================= NEXT / FINISH ================= */}

            <Pressable
                disabled={!selected}
                onPress={async () => {
                    if (!selected) return;

                    await saveAnswer(question._id, selected);

                    setSelected(null);
                    setCurrentIndex(i => i + 1);
                }}
                style={{
                    marginTop: 'auto',
                    backgroundColor: selected ? '#16a34a' : '#94a3b8',
                    paddingVertical: 16,
                    borderRadius: 14,
                    alignItems: 'center',
                }}
            >
                <Text style={{ color: 'white', fontSize: 18 }}>
                    {currentIndex + 1 === questions.length ? 'Finish' : 'Next'}
                </Text>
            </Pressable>
        </View>
    );
}

