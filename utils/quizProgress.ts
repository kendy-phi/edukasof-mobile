import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'QUIZ_PROGRESS';

type QuizProgress = {
  quizId: string;
  currentIndex: number;
  answers: Record<string, string[]>;
};

export const saveQuizProgress = async (data: QuizProgress) => {
  const saved = await AsyncStorage.getItem(KEY);

  const allProgress = saved ? JSON.parse(saved) : {};

  // Save per quizId
  allProgress[data.quizId] = data;

  await AsyncStorage.setItem(KEY, JSON.stringify(allProgress));
};

export const getQuizProgress = async (quizId: string) => {
  const saved = await AsyncStorage.getItem(KEY);

  if (!saved) return null;

  const allProgress = JSON.parse(saved);

  return allProgress[quizId] || null;
};

export const getAllQuizProgress = async () => {
  const saved = await AsyncStorage.getItem(KEY);
  return saved ? JSON.parse(saved) : {};
};

export const clearQuizProgress = async (quizId: string) => {
  const saved = await AsyncStorage.getItem(KEY);

  if (!saved) return;

  const allProgress = JSON.parse(saved);

  delete allProgress[quizId];

  await AsyncStorage.setItem(KEY, JSON.stringify(allProgress));
};

export const deleteQuizzesProgress = async () =>{
  await AsyncStorage.removeItem(KEY);
  const saved = await AsyncStorage.getItem(KEY);
  console.log("After cache suppression: ", saved);
  
}
