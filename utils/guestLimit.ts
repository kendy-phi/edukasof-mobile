import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'GUEST_QUIZ_COUNT';
const LIMIT = 3;

export const getGuestQuizCount = async () => {
  const saved = await AsyncStorage.getItem(KEY);
  return saved ? parseInt(saved) : 0;
};

export const incrementGuestQuizCount = async () => {
  const count = await getGuestQuizCount();
  const newCount = count + 1;

  await AsyncStorage.setItem(KEY, newCount.toString());
  return newCount;
};

export const hasReachedGuestLimit = async () => {
  const count = await getGuestQuizCount();
  return count >= LIMIT;
};

export const resetGuestQuizCount = async () => {
  await AsyncStorage.removeItem(KEY);
};
