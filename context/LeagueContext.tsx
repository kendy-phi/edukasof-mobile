import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from 'react';

import { ENV, SOCKET_KEY } from '../config/env';
import socketService from '../service/SocketService';

/* =========================
 * Types
 * ========================= */
import { League } from '@/types/league';

export interface Participant {
  userId: string;
  userName: string;
  joinedAt?: string;
}

export interface LeaderboardEntry {
  userId: string;
  score: number;
}

export interface LeagueQuestion {
  _id: string;
  type: string;
  questionText: string;
  options?: string[];
  timer?: number;
  points?: number;
}

interface SubmitAnswerPayload {
  leagueId: string;
  userId: string;
  questionId: string;
  answer: string[];
}

interface LeagueContextType {
  participants: Participant[];
  currentQuestion: LeagueQuestion | null;
  leaderboard: LeaderboardEntry[];
  leagueStarted: boolean;
  leagueFinished: boolean;
  isSocketConnected: boolean;
  currentLeague: League | null;
  lastPlayerJoined: any;
  setCurrentLeague: (league: League | null) => void;
  ensureConnected: () => void;
  joinLeague: (
    leagueId: string,
    userId: string,
    userName: string,
  ) => void;
  submitAnswer: (payload: SubmitAnswerPayload) => void;
  clearLeague: () => void;
}

const LeagueContext = createContext<LeagueContextType | null>(null);

/* =========================
 * Provider
 * ========================= */

export const LeagueProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [currentQuestion, setCurrentQuestion] =
    useState<LeagueQuestion | null>(null);
  const [leagueStarted, setLeagueStarted] = useState(false);
  const [leagueFinished, setLeagueFinished] = useState(false);
  const [currentLeague, setCurrentLeague] = useState<League | null>(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [lastPlayerJoined, setLastPlayerJoined] = useState<any>(null);

  /* =========================
   * Socket listeners
   * ========================= */
  useEffect(() => {
    console.log('🧠 [LeagueContext] useEffect MOUNT');

    const onConnect = () => {
      console.log('🟢 [LeagueContext] socket CONNECT event');
      setIsSocketConnected(true);
    };

    const onDisconnect = (reason?: any) => {
      console.log('🔴 [LeagueContext] socket DISCONNECT event =>', reason);
      setIsSocketConnected(false);
    };

    const onPlayerJoined = (data: any) => {
      console.log(
        '👤 [LeagueContext] playerJoined listener FIRED =>',
        JSON.stringify(data, null, 2),
      );

      const list =
        data?.participants ??
        data?.result?.participants ??
        [];

      console.log('👥 [LeagueContext] participants extracted =>', list);

      setParticipants(Array.isArray(list) ? list : []);
      setLastPlayerJoined(data?.userId ?? null);
    };

    const onLeagueStarted = (question: LeagueQuestion) => {
      console.log('🚀 [LeagueContext] leagueStarted listener FIRED =>', question);
      setLeagueStarted(true);
      setCurrentQuestion(question);
    };

    const onQuestionStarted = (question: LeagueQuestion) => {
      console.log('❓ [LeagueContext] questionStarted listener FIRED =>', question);
      setCurrentQuestion(question);
    };

    const onLeaderboardUpdated = (data: LeaderboardEntry[]) => {
      console.log('🏆 [LeagueContext] leaderboardUpdated listener FIRED =>', data);
      setLeaderboard(Array.isArray(data) ? data : []);
    };

    const onLeagueFinished = () => {
      console.log('🏁 [LeagueContext] leagueFinished listener FIRED');
      setLeagueFinished(true);
    };

    // état de connexion actuel
    const connectedNow = socketService.isConnected();
    console.log('🔌 [LeagueContext] socket already connected? =>', connectedNow);
    setIsSocketConnected(connectedNow);

    // montage des listeners
    console.log('➕ [LeagueContext] add listener => connect');
    socketService.on('connect', onConnect);

    console.log('➕ [LeagueContext] add listener => disconnect');
    socketService.on('disconnect', onDisconnect);

    console.log('➕ [LeagueContext] add listener =>', SOCKET_KEY.ON_PLAYER_JOINED);
    socketService.on(SOCKET_KEY.ON_PLAYER_JOINED, onPlayerJoined);

    console.log('➕ [LeagueContext] add listener =>', SOCKET_KEY.ON_LEAGUE_STARTED);
    socketService.on(SOCKET_KEY.ON_LEAGUE_STARTED, onLeagueStarted);

    console.log('➕ [LeagueContext] add listener =>', SOCKET_KEY.ON_QUESTION_STARTED);
    socketService.on(SOCKET_KEY.ON_QUESTION_STARTED, onQuestionStarted);

    console.log('➕ [LeagueContext] add listener =>', SOCKET_KEY.ON_LEADERBOARD_UPDATED);
    socketService.on(SOCKET_KEY.ON_LEADERBOARD_UPDATED, onLeaderboardUpdated);

    console.log('➕ [LeagueContext] add listener =>', SOCKET_KEY.ON_LEAGUE_FINISHED);
    socketService.on(SOCKET_KEY.ON_LEAGUE_FINISHED, onLeagueFinished);

    return () => {
      console.log('🧹 [LeagueContext] useEffect CLEANUP');

      console.log('➖ [LeagueContext] remove listener => connect');
      socketService.off('connect', onConnect);

      console.log('➖ [LeagueContext] remove listener => disconnect');
      socketService.off('disconnect', onDisconnect);

      console.log('➖ [LeagueContext] remove listener =>', SOCKET_KEY.ON_PLAYER_JOINED);
      socketService.off(SOCKET_KEY.ON_PLAYER_JOINED, onPlayerJoined);

      console.log('➖ [LeagueContext] remove listener =>', SOCKET_KEY.ON_LEAGUE_STARTED);
      socketService.off(SOCKET_KEY.ON_LEAGUE_STARTED, onLeagueStarted);

      console.log('➖ [LeagueContext] remove listener =>', SOCKET_KEY.ON_QUESTION_STARTED);
      socketService.off(SOCKET_KEY.ON_QUESTION_STARTED, onQuestionStarted);

      console.log('➖ [LeagueContext] remove listener =>', SOCKET_KEY.ON_LEADERBOARD_UPDATED);
      socketService.off(SOCKET_KEY.ON_LEADERBOARD_UPDATED, onLeaderboardUpdated);

      console.log('➖ [LeagueContext] remove listener =>', SOCKET_KEY.ON_LEAGUE_FINISHED);
      socketService.off(SOCKET_KEY.ON_LEAGUE_FINISHED, onLeagueFinished);
    };
  }, []);

  /* =========================
   * Actions
   * ========================= */

  const ensureConnected = useCallback(() => {
    if (socketService.isConnected()) {
      setIsSocketConnected(true);
      return;
    }

    console.log(
      '[LEAGUE] ensureConnected => connecting to',
      ENV.WEBSOCKET_URL,
    );

    socketService.connect(ENV.WEBSOCKET_URL);
  }, []);

  const joinLeague = useCallback(
    (leagueId: string, userId: string, userName: string) => {
      ensureConnected();

      console.log(
        '[LEAGUE] joinLeague =>',
        leagueId,
        userId,
        userName,
      );

      socketService.emit(SOCKET_KEY.JOIN_LEAGUE, {
        leagueId,
        userId,
        userName,
      });
    },
    [ensureConnected],
  );

  const submitAnswer = useCallback(
    (payload: SubmitAnswerPayload) => {
      ensureConnected();

      console.log('[LEAGUE] submitAnswer =>', payload);

      socketService.emit(SOCKET_KEY.ON_SUBMIT_ANSWER, payload);
    },
    [ensureConnected],
  );

  const clearLeague = useCallback(() => {
    setParticipants([]);
    setLeaderboard([]);
    setCurrentQuestion(null);
    setLeagueStarted(false);
    setLeagueFinished(false);
    setCurrentLeague(null);
    setLastPlayerJoined(null);
  }, []);

  /* =========================
   * Context value
   * ========================= */

  const value = useMemo<LeagueContextType>(
    () => ({
      participants,
      currentQuestion,
      leaderboard,
      leagueStarted,
      leagueFinished,
      isSocketConnected,
      currentLeague,
      lastPlayerJoined,
      setCurrentLeague,
      ensureConnected,
      joinLeague,
      submitAnswer,
      clearLeague,
    }),
    [
      participants,
      currentQuestion,
      leaderboard,
      leagueStarted,
      leagueFinished,
      isSocketConnected,
      currentLeague,
      lastPlayerJoined,
      ensureConnected,
      joinLeague,
      submitAnswer,
      clearLeague,
    ],
  );

  return (
    <LeagueContext.Provider value={value}>
      {children}
    </LeagueContext.Provider>
  );
};

/* =========================
 * Hook
 * ========================= */

export const useLeague = () => {
  const context = useContext(LeagueContext);

  if (!context) {
    throw new Error(
      'useLeague must be used inside LeagueProvider',
    );
  }

  return context;
};