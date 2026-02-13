import { nestApi } from "./nest";

export const getQuizzes = async (page = 1, limit = 10) => {
    const response = await nestApi.get('/quiz', {
        params: { page, limit },
    });

    return response.data;
};
