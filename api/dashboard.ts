import { laravelClient } from '@/service/laravelClient';

import { AxiosInstance } from 'axios';

export const dashboardApi = (api: AxiosInstance) => ({
    getSchoolDashboard: async () => {
        const response = await laravelClient.get('/api/student/dashboard');
        return response.data;
    },
    getQuizStats: async () => {
        const response = await api.get('/me/stats');//console.log(response.data);  
        return response.data.data;
    },

    getQuizHistory: async () => {
        const response = await api.get('/quiz-attempts/my')//;console.log(response.data);
        return response.data;
    },

    getUserQuizInput: async (attempId: string) => {
        const response = await api.get(`/answers/attempt/${attempId}`)//;console.log(response.data)
        return response.data;
    }

});