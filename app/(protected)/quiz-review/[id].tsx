import { getUserQuizInput } from '@/api/dashboard';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

const C = {
    bg: '#ffffff',
    surface: '#f8fafc',
    border: '#e5e7eb',
    text: '#111827',
    muted: '#6b7280',
    accent: '#2563eb',
    success: '#16a34a',
};

export default function QuizReview() {
    const { id, quizName } = useLocalSearchParams();
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const loadReview = async () => {
            try {
                const response = await getUserQuizInput(id.toString());
                setData(response);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        loadReview();
    }, []);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <ActivityIndicator size="large" color="#2563eb" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Révision des questions: {quizName}</Text>

            {data.map((item, index) => (

                    <View key={index} style={item.isCorrect ? styles.card_success : styles.card_failed}>
                        <View style={styles.questionHeader}>
                            <Text style={styles.questionText}>
                                {index + 1}. {item.questionId.questionText}
                            </Text>

                            <View
                                style={[
                                    styles.badge,
                                    item.isCorrect ? styles.correct : styles.incorrect,
                                ]}
                            >
                                <Text style={styles.badgeText}>
                                    {item.isCorrect ? 'Correct' : 'Incorrect'}
                                </Text>
                            </View>
                        </View>

                        <Text style={styles.answer}>
                            Votre reponse: {item.studentAnswer}
                        </Text>

                        {!item.isCorrect && (
                            <Text style={styles.correctAnswer}>
                                Reponse correcte: {item.questionId.correctAnswer}
                            </Text>
                        )}
                    </View>
                )
            )}
            <View style={styles.actions}>
                <Pressable style={styles.primaryButton} onPress={() =>{ router.replace('/dashboard')}}>
                    <Text style={styles.primaryText}> Tableau de bord</Text>
                </Pressable>

                <Pressable style={styles.secondaryButton} onPress={() =>{ router.replace('/home')}}>
                    <Text style={styles.secondaryText}> Lister Quiz</Text>
                </Pressable>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    actions: {
        marginBottom: 20,
    },

    primaryButton: {
        backgroundColor: C.accent,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 12,
    },

    primaryText: {
        color: '#fff',
        fontWeight: '600',
    },
    secondaryButton: {
        borderWidth: 1,
        borderColor: C.border,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },

    secondaryText: {
        color: C.text,
        fontWeight: '500',
    },

    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
        padding: 20,
    },

    title: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 20,
    },

    card_success: {
        backgroundColor: '#e6f4ea',
        padding: 16,
        borderRadius: 14,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#16a34a',
    },

    card_failed: {
        backgroundColor: '#dfd2d6',
        padding: 16,
        borderRadius: 14,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#a31624',
    },

    questionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    questionText: {
        flex: 1,
        fontSize: 15,
        fontWeight: '500',
    },

    buttonText: {
        flex: 1,
        fontSize: 20,
        fontWeight: '500'
    },

    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },

    correct: {
        backgroundColor: '#16a34a',
    },

    incorrect: {
        backgroundColor: '#dc2626',
    },

    badgeText: {
        color: '#fff',
        fontSize: 12,
    },

    answer: {
        marginTop: 8,
        fontSize: 14,
    },

    correctAnswer: {
        marginTop: 4,
        fontSize: 14,
        color: '#16a34a',
    },
});
