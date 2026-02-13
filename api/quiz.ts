import { nestApi } from "./nest";

export const getQuizzes = async (page = 1, limit = 10) => {
    const isPublished = true;
    const response = await nestApi.get('/quiz/search/filters', {
        params: { page, limit, isPublished },
    });
    
    // console.log(response.data);    

    return response.data;
};
