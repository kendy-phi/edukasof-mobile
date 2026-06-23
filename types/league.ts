
export type LeagueStatus = 'open' | 'close';

export type League = {
    _id: string, //6a3add5f647e937f4b0bf549
    createdBy: string,
    issuer: string,
    quizId: string,
    title: string,
    description: string,
    shareToken: string,
    sharePin: string,
    isLive: boolean,
    status: LeagueStatus,
    maxParticipants: number,
    deadline: string|null,
    createdAt: string,
    updatedAt: string,
}