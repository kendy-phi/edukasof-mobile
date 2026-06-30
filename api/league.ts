import { League } from '@/types/league';
import { AxiosInstance } from 'axios';

export const leagueApi = (api: AxiosInstance) => ({
    
    all: async () => {
        console.log(`base url: ${api.defaults.baseURL}`);
        const response = await api.get('/leagues');
        return response.data;
    },

    joinWithSharePin: async (token:string):Promise<League> =>{
        console.log(`base url: ${api.defaults.baseURL}, token: ${token}`);
        const response = await api.patch(`/leagues/token/${token}/join`);
        const data = response.data;
        console.log(`join league /leagues/token/${token}/join ==> `, data._id);
        return data;
    }  

});