import { laravelClient } from '@/service/laravelClient';
import { quizClient } from '@/service/quizClient';

export const getSchoolDashboard = async () => {
  const response = await laravelClient.get('/api/student/dashboard');
  return response.data;
};

export const getQuizStats = async () => {
  const response = await quizClient.get('/me/stats');//console.log(response.data);  
  return response.data.data;
};

export const getQuizHistory = async () => {
  const response = await quizClient.get('/quiz-attempts/my')//;console.log(response.data);
  return response.data;
};

export const getUserQuizInput = async (attempId:string) => {
    const response = await quizClient.get(`/answers/attempt/${attempId}`)//;console.log(response.data)
    return response.data;
}
