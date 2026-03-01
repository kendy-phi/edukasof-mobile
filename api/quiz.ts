import { Answer } from '@/types/question';
import { AxiosInstance } from 'axios';

export const quizApi = (api: AxiosInstance) => ({
    all: async () => {
        const response = await api.get('/quiz');
        return response.data;
    },

    load: async (page = 1, limit = 10) => {
        const isPublished = true;
        const response = await api.get('/quiz/search/filters', {
            params: { page, limit, isPublished }
        });
        
        return response.data;
    },

    description: async (id:string) =>{
        const response = await api.get(`/quiz/${id}`);
        return response.data;
    },

    loadQuizWithQuestion: async (id: string) => {
        const response = await api.get(`/quiz/loadQuestion/${id}`);
        return response.data;
    },

    QuizInput: async (attempId: string) => {
        const response = await api.get(`/answers/attempt/${attempId}`)//;console.log(response.data)
        return response.data;
    },

    startQuiz: async (quizId: string) => {
        const response = await api.post(`/quiz-attempts/start`,{
            quizId
        });
        return response.data;
    },
    
    finishedQuiz: async (id: string, data:{score:number, totalQuestions: number}) => {
        const response = await api.patch(`/quiz-attempts/${id}/finish`, data);
        return response.data;    
    },
    
    completedQuiz: async () => {
        const response = await api.post(`/quiz-attempts/my`);   
        return response.data;     
    },

    loadQuestion: async (attempId: string) => {
        const response = await api.post(`/quiz-attempts/${attempId}`);   
        return response.data;
    },

    storeAnswers: async (answers: Answer[]) => {
        console.log("aswer to send: ", answers);
        const response = await api.post(`/answers/bulk/`, answers);
        return response.data;
    }
    

});