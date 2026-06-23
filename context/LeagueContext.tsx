import React, {
    createContext,
    useEffect,
    useMemo,
    useState,
    useContext
} from "react";
import { SOCKET_KEY } from '../config/env';
import socketService from '../service/SocketService';

export interface Participant {
    userId: string;
    userName: string;
    joinedAt: string;
}

export interface LeaderBoardEntry {
    userId: string;
    score: number;
}

export interface LeagueQuestion{
    _id: string;
    type: string;
    questionText: string;
    options?: string[];
    timer: number;
    points?: number;
}

interface LeagueContextType{
    participants: Participant[];
    currentQuestion: LeagueQuestion | null;
    leaderBoard: LeaderBoardEntry[];
    leagueStarted: boolean;
    currentLeague: any;
    setCurrentLeague: (
    league: any,
    ) => void;
    joinLeague: (leagueId: string, userId: string, userName: string) => void;
    submitAnswer: (payload:{
        leagueId:string,
        userId: string,
        questionId: string,
        answer: string[]
    }) => void;
    clearLeague: () => void;
}

const LeagueContext = createContext<LeagueContextType | null>(null,);

export const LeagueProvider = ({ children } : { children: React.ReactNode }) => {
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [leaderBoard, setLeaderBoard] = useState<LeaderBoardEntry[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState<LeagueQuestion | null>(null);
    const [leagueStarted, setLeagueStarted] = useState(false);
    const [leagueFinished, setLeagueFinished] = useState(false);
    const [currentLeague, setCurrentLeague] = useState<any>(null);

    useEffect(() => {

        socketService.on(SOCKET_KEY.ON_PLAYER_JOINED, (data: any) =>{
            const list = data?.participants ?? data?.result?.participants ?? [];
            console.log(list, data);
            setParticipants(list);
        });

        socketService.on(SOCKET_KEY.ON_LEAGUE_STARTED, (question: any) =>{
            setLeagueStarted(true);
            setCurrentQuestion(question);
        });

        socketService.on(SOCKET_KEY.ON_QUESTION_STARTED, (question:any) => {
            setCurrentQuestion(question);
        });

        socketService.on(SOCKET_KEY.ON_LEADERBOARD_UPDATED, (data:any) => {
            setLeaderBoard(data || null)
        });

        socketService.on(SOCKET_KEY.ON_LEAGUE_FINISHED, ()=>{
            setLeagueFinished(true);
        });

        return () => {
            socketService.off(SOCKET_KEY.ON_PLAYER_JOINED,)
            socketService.off(SOCKET_KEY.ON_LEAGUE_STARTED,)
            socketService.off(SOCKET_KEY.ON_QUESTION_STARTED,)
            socketService.off(SOCKET_KEY.ON_LEADERBOARD_UPDATED,)
            socketService.off(SOCKET_KEY.ON_LEAGUE_FINISHED,)
        }

    }, []);

    const joinLeague = (leagueId: string, userId: string, userName: string) =>{
        socketService.emit(SOCKET_KEY.JOIN_LEAGUE,{
            leagueId, userId, userName
        });
    }

    const submitAnswer = (payload: { 
        leagueId:string; 
        userId:string; 
        questionId: string; 
        answer: string[] 
    }) =>{
        socketService.emit(SOCKET_KEY.ON_SUBMIT_ANSWER, payload);
    }

    const clearLeague = () =>{
        setParticipants([]);
        setLeaderBoard([]);
        setCurrentQuestion(null);
        setLeagueStarted(false);
        setLeagueFinished(false);
    };

    const isConnected = ()=>{
        return socketService.isConnected();
    }

    const value = useMemo(()=>({
        participants,
        currentQuestion,
        leaderBoard,
        leagueStarted,
        leagueFinished,
        currentLeague,
        setCurrentLeague,
        joinLeague,
        submitAnswer,
        clearLeague,
        isConnected
    }), [
        participants,
        currentQuestion,
        leaderBoard,
        currentLeague
    ]);

    return (
        <LeagueContext.Provider
            value={value}>
            {children}
        </LeagueContext.Provider>
    );

}

export const useLeague =
  () => {

    const context =
      useContext(
        LeagueContext,
      );

    if (!context) {

      throw new Error(
        'useLeague must be used inside LeagueProvider',
      );
    }

    return context;
  };
