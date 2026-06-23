
export const ENV = {
  LARAVEL_API: `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/v1` || "https://staging.edukasof.com/api/v1",
  NEST_API: `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/v1` || "https://staging.edukasof.com/api/v1",
  WEBSOCKET_URL: `${process.env.EXPO_PUBLIC_WEB_SOCKET_URL}` || "https://quiz-api.edukasof.com"
};

export const SOCKET_KEY = {
  JOIN_LEAGUE: "joinLeague",
  ON_PLAYER_JOINED: "playerJoined",
  ON_LEAGUE_STARTED: "leagueStarted",
  ON_LEAGUE_FINISHED: "leagueFinished",
  ON_QUESTION_STARTED: "questionStarted",
  ON_LEADERBOARD_UPDATED: "leaderboardUpdated",
  ON_SUBMIT_ANSWER: "submitAnswer",
}