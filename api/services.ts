import { authApi } from './auth';
import { createApiClient } from './axiosFactory';
import { dashboardApi } from './dashboard';
import { leagueApi } from './league';
import { quizApi } from './quiz';

export const createServices = (tenantType: string) => {
    const api = createApiClient(tenantType);
    return {
        auth: authApi(api),
        quiz: quizApi(api),
        dashboard: dashboardApi(api),
        league: leagueApi(api)
    };
};