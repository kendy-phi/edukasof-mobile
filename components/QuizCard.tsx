import { Pressable, Text, View } from 'react-native';
import { Quiz } from '../types/quiz';

const GRADIENTS: Record<string, string[]> = {
  Easy: ['#8b5cf6', '#a855f7'],
  Medium: ['#06b6d4', '#0891b2'],
  Hard: ['#10b981', '#059669'],
};

export function QuizCard({
  quiz,
  onPress,
}: {
  quiz: Quiz;
  onPress: () => void;
}) {
  const colors = GRADIENTS[quiz.difficulty] ?? ['#64748b', '#475569'];

  return (
    <Pressable
      onPress={onPress}
      style={{
        flex: 1,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: colors[0],
        minHeight: 160,
      }}
    >
      {/* Top */}
      <View style={{ padding: 14 }}>
        <View
          style={{
            alignSelf: 'flex-end',
            backgroundColor: 'rgba(255,255,255,0.25)',
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 12,
          }}
        >
          <Text style={{ color: 'white', fontSize: 12 }}>
            {quiz.difficulty.toUpperCase()}
          </Text>
        </View>

        <Text
          style={{
            color: 'white',
            fontSize: 18,
            fontWeight: '700',
            marginTop: 16,
          }}
        >
          {quiz.title}
        </Text>

        <Text style={{ color: 'white', opacity: 0.9, marginTop: 4 }}>
          {quiz.category}
        </Text>
      </View>

      {/* Bottom */}
      <View
        style={{
          backgroundColor: 'white',
          padding: 12,
          marginTop: 'auto',
        }}
      >
        <Text style={{ color: '#475569', fontSize: 13 }}>
          ⏱️ {quiz.duration} mins
        </Text>
      </View>
    </Pressable>
  );
}
