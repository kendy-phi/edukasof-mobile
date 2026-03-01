import { useEffect, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { nestApi } from '@/api/nest';
import { saveQuizProgress, getQuizProgress, clearQuizProgress } from '@/utils/quizProgress';
import { useTheme } from '@/context/ThemeContext';

type Question = {
  _id: string;
  type: 'MCQ' | 'TRUE_FALSE' | 'SHORT_ANSWER' | 'MULTI_SELECT';
  questionText: string;
  options?: string[];
};

export default function PlayQuizScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { theme } = useTheme();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // 🔹 Load Questions
  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const response = await nestApi.get(`/quiz/loadQuestion/${id}`);
        const sorted = response.data.questions.sort(
          (a: any, b: any) => a.order - b.order
        );

        setQuestions(sorted);
      } catch (error) {
        console.log('Error loading quiz:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) loadQuiz();
  }, [id]);

  // 🔹 Recover Progress
  useEffect(() => {
    const recover = async () => {
      const progress = await getQuizProgress();

      if (progress && progress.quizId === id) {
        setCurrentIndex(progress.currentIndex);
        setAnswers(progress.answers);
      }
    };

    recover();
  }, [id]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  const question = questions[currentIndex];
  if (!question) return null;

  const isLast = currentIndex === questions.length - 1;

  const handleNext = async () => {
    if (!selected) return;

    const nextIndex = currentIndex + 1;

    const newAnswers = {
      ...answers,
      [question._id]: selected,
    };

    // 🔹 Save Progress
    await saveQuizProgress({
      quizId: id,
      currentIndex: nextIndex,
      answers: newAnswers,
    });

    setAnswers(newAnswers);

    if (isLast) {
      // 🔹 Submit to backend
      await nestApi.post('/quiz/submit', {
        quizId: id,
        answers: newAnswers,
      });

      await clearQuizProgress();

      router.replace(`/quiz/${id}/result`);
    } else {
      setCurrentIndex(nextIndex);
      setSelected(null);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {/* Question */}
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
        question.options?.map((option) => (
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
                color:
                  selected === option ? 'white' : theme.text,
              }}
            >
              {option}
            </Text>
          </Pressable>
        ))}

      {/* TRUE_FALSE */}
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
                color:
                  selected === option ? 'white' : theme.text,
              }}
            >
              {option}
            </Text>
          </Pressable>
        ))}

      {/* SHORT ANSWER */}
      {question.type === 'SHORT_ANSWER' && (
        <TextInput
          value={selected ?? ''}
          onChangeText={setSelected}
          placeholder="Votre réponse..."
          style={{
            borderWidth: 1,
            borderColor: theme.border,
            borderRadius: 12,
            padding: 14,
            color: theme.text,
          }}
        />
      )}

      {/* NEXT BUTTON */}
      <Pressable
        disabled={!selected}
        onPress={handleNext}
        style={{
          marginTop: 'auto',
          backgroundColor: selected
            ? theme.primary
            : '#94a3b8',
          paddingVertical: 16,
          borderRadius: 14,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white', fontSize: 18 }}>
          {isLast ? 'Finish' : 'Next'}
        </Text>
      </Pressable>
    </View>
  );
}
