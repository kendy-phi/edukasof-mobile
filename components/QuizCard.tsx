import { Quiz } from '@/types/quiz';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Text, View } from 'react-native';

type Props = {
    quiz: Quiz & {
        questionCount?: number;
    };
    onPress: () => void;
    progressPercentage?: number;
};


const DIFFICULTY_COLORS: Record<string, string[]> = {
    Low: ['#34d399', '#059669'],
    Medium: ['#22d3ee', '#0891b2'],
    Hard: ['#f97316', '#ea580c'],
};

export function QuizCard({ quiz, onPress, progressPercentage }: Props) {
    const gradient = DIFFICULTY_COLORS[quiz.difficulty] ?? ['#38bdf8', '#0284c7'];
    console.log("print quiz difficulty: ", quiz.difficulty);

    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => ({
                transform: [{ scale: pressed ? 0.97 : 1 }],
                shadowColor: '#000',
                shadowOpacity: pressed ? 0.1 : 0.05,
                shadowRadius: 12,
                shadowOffset: { width: 0, height: 6 },
            })}
        >
            <View
                style={{
                    backgroundColor: 'white',
                    borderRadius: 20,
                    overflow: 'hidden',
                }}
            >
                {/* ===== TOP / HEADER ===== */}
                <LinearGradient
                    colors={gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                        height: 160,
                        padding: 20,
                        justifyContent: 'flex-end',
                    }}
                >
                    {/* Difficulty badge */}
                    <View
                        style={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            backgroundColor: 'rgba(255,255,255,0.25)',
                            paddingHorizontal: 10,
                            paddingVertical: 4,
                            borderRadius: 10,
                        }}
                    >
                        <Text
                            style={{
                                color: 'white',
                                fontSize: 12,
                                fontWeight: '700',
                                textTransform: 'uppercase',
                                letterSpacing: 0.8,
                            }}
                        >
                            {quiz.difficulty}
                        </Text>
                    </View>

                    {/* Title */}
                    <Text
                        style={{
                            color: 'white',
                            fontSize: 20,
                            fontWeight: '800',
                        }}
                    >
                        {quiz.title}
                    </Text>

                    {/* Questions count */}
                    <Text
                        style={{
                            color: 'rgba(255,255,255,0.9)',
                            marginTop: 4,
                            fontSize: 14,
                            fontWeight: '500',
                        }}
                    >
                        {quiz.questionCount ?? 0} Questions
                    </Text>
                </LinearGradient>

                {/* ===== BOTTOM ===== */}
                <View style={{ padding: 16 }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 12,
                        }}
                    >
                        {/* Duration */}
                        <Text
                            style={{
                                color: '#64748b',
                                fontSize: 14,
                                fontWeight: '500',
                            }}
                        >
                            ⏱ {quiz.duration} mins
                        </Text>

                        {/* Details hint */}
                        <Text
                            style={{
                                color: '#4f46e5',
                                fontSize: 14,
                                fontWeight: '600',
                            }}
                        >
                            Details →
                        </Text>
                    </View>

                    {/* Progress accent */}
                    <View
                        style={{
                            height: 6,
                            backgroundColor: '#e5e7eb',
                            borderRadius: 999,
                            overflow: 'hidden',
                        }}
                    >
                        <View
                            style={{
                                height: '100%',
                                width: `${Math.min(progressPercentage ?? 0, 100)}%`,
                                backgroundColor: '#6366f1',
                            }}
                        />
                    </View>
                </View>
            </View>
        </Pressable>
    );
}
