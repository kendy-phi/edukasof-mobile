import { Answer } from '@/types/question';
import { AxiosInstance } from 'axios';

export const quizApi = (api: AxiosInstance) => ({
    all: async () => {
        const response = await api.get('/quiz');
        return response.data;
    },

    load: async (page = 1, limit = 10) => {
        const isPublished = true;
        const response = await api.get('/quiz/search', {
            params: { page, limit, isPublished }
        });
        
        return response.data;
    },

    description: async (id:string) =>{
        const response = await api.get(`/quiz/${id}`);
        return response.data;
    },

    loadQuizWithQuestion: async (id: string) => {
        const response = await api.get(`/quiz/question/${id}`);
        return response.data;
    },

    QuizInput: async (attempId: string) => {
        const response = await api.get(`/answers/attempt/${attempId}`)//;console.log(response.data)
        return response.data;
    },

    startQuiz: async (quizId: string) => {
        const response = await api.post(`/quiz/play`,{
            quizId
        });
        return response.data;
    },
    
    finishedQuiz: async (id: string, data:{score:number, totalQuestions: number}) => {
        const response = await api.post(`/quiz/complete/${id}`, data);
        return response.data;    
    },
    
    completedQuiz: async () => {
        const response = await api.get(`/quiz/me`);   
        return response.data;     
    },

    loadQuestion: async (attempId: string) => {
        const response = await api.get(`/quiz-attempts/${attempId}`);   
        return response.data;
    },

    storeAnswers: async (answers: Answer[]) => {
        console.log("aswer to send: ", answers);
        const response = await api.post(`/quiz/answers/`, answers);//answers/bulk/
        return response.data;
    },

    validate: async (data:any, id:string, auth:boolean) => {
        console.log("parse data to submit: ", data, " for id: ", id, "auth: ", auth);
        const response = await api.post(`/quiz/validation/${id}?auth=${auth}`, data);///answers/validation/${id}
        return response.data;
    }    

});