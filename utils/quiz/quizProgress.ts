import AsyncStorage from '@react-native-async-storage/async-storage';
import { resetGuestQuizCount } from '../guestLimit';

const KEY = 'EDUKASOF_QUIZ_PROGRESS';

type QuizProgress = {
  quizId: string;
  currentIndex: number;
  answers: Record<string, string[]>;
  time: number
};

export const saveQuizProgress = async (data: QuizProgress) => {
  const saved = await AsyncStorage.getItem(KEY);
  console.log(`saved quiz`, data, saved);
  const allProgress = saved ? JSON.parse(saved) : {};

  // Save per quizId
  allProgress[data.quizId] = data;

  await AsyncStorage.setItem(KEY, JSON.stringify(allProgress));
};

export const getQuizProgress = async (quizId: string) => {
  const saved = await AsyncStorage.getItem(KEY);
  console.log(`load saved quiz`, saved);
  
  if (!saved) return null;

  const allProgress = JSON.parse(saved);

  const data = allProgress[quizId] || null;

  console.log(`return quiz loaded: `, data, `quid id ==> `, quizId);  

  return data
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
  await resetGuestQuizCount();  
}
