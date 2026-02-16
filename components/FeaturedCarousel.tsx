import { useTheme } from '@/context/ThemeContext';
import { Quiz } from '@/types/quiz';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

type Props = {
    quizzes: Quiz[];
};

export default function FeaturedCarousel({ quizzes }: Props) {
    const { theme, mode } = useTheme();
    const router = useRouter();

    if (!quizzes.length) return null;

    const getGradient = (difficulty?: string) => {
        if (difficulty === 'Low') return ['#22c55e', '#15803d'];
        if (difficulty === 'Medium') return ['#22d3ee', '#0369a1'];
        if (difficulty === 'Hard') return ['#fb923c', '#c2410c'];
        return mode === 'dark'
            ? ['#334155', '#1e293b']
            : ['#3b82f6', '#2563eb'];
    };

    return (
        <View style={{ marginBottom: 32 }}>
            <Text
                style={{
                    fontSize: 22,
                    fontWeight: '800',
                    color: theme.text,
                    marginBottom: 16,
                }}
            >
                🔥 À la une
            </Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {quizzes.map((quiz) => (
                    <Pressable
                        key={quiz.id}
                        onPress={() => router.push(`/quiz/${quiz.id}`)}
                        style={({ pressed }) => ({
                            width: 280,
                            height: 120,
                            marginRight: 18,
                            borderRadius: 20,
                            overflow: 'hidden',
                            transform: [{ scale: pressed ? 0.97 : 1 }],
                        })}
                    >
                        <LinearGradient
                            colors={getGradient(quiz.difficulty)}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={{
                                height: 130,
                                padding: 16,
                                justifyContent: 'space-between',
                            }}
                        >
                            {/* TOP ROW */}
                            <View style={{ alignItems: 'flex-end' }}>
                                <View
                                    style={{
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
                                        }}
                                    >
                                        {quiz.difficulty}
                                    </Text>
                                </View>
                            </View>

                            {/* BOTTOM CONTENT */}
                            <View>
                                <Text
                                    style={{
                                        color: 'white',
                                        fontSize: 22,
                                        fontWeight: '800',
                                    }}
                                >
                                    {quiz.title}
                                </Text>

                                <Text
                                    style={{
                                        color: 'rgba(255,255,255,0.9)',
                                        marginTop: 6,
                                        fontSize: 14,
                                    }}
                                >
                                    {quiz.questionCount} Questions • {quiz.duration} mins
                                </Text>
                            </View>
                        </LinearGradient>

                    </Pressable>
                ))}
            </ScrollView>
        </View>
    );
}