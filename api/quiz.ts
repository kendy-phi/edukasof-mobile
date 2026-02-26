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

    staredtQuiz: async () => {
        const response = await api.post(`/quiz-attempts/start`);
        return response.data;
    },
    
    finishedQuiz: async (id: string) => {
        const response = await api.post(`/quiz-attempts/${id}/finish`);
        return response.data;    
    },
    
    completedQuiz: async () => {
        const response = await api.post(`/quiz-attempts/my`);   
        return response.data;     
    },

    loadQuestion: async (attempId: string) => {
        const response = await api.post(`/quiz-attempts/${attempId}`);   
        return response.data;
    }

});