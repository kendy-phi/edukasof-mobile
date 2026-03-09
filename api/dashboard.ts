import { laravelClient } from '@/service/laravelClient';

import { AxiosInstance } from 'axios';

export const dashboardApi = (api: AxiosInstance) => ({
    getSchoolDashboard: async () => {
        const response = await laravelClient.get('/api/student/dashboard');
        return response.data;
    },
    getQuizStats: async () => {
        const response = await api.get('/user/statistic/my');//console.log(response.data);  
        return response.data.data;
    },

    getQuizHistory: async () => {
        const response = await api.get('/user/attempts')//;console.log(response.data);
        return response.data;
    },

    //`/answers/attempt/${attempId}`
    getUserQuizInput: async (attempId: string) => {
        const response = await api.get(`/user/attempts/${attempId}`)//;console.log(response.data)
        return response.data;
    }

});