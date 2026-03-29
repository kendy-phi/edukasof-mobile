export function analyzeMultiAnswer(correct: string[], user: string[]) {
  const correctAnswers = user.filter(a => correct.includes(a));
  const wrongAnswers = user.filter(a => !correct.includes(a));
  const missingAnswers = correct.filter(a => !user.includes(a));

  const isPerfect =
    correctAnswers.length === correct.length &&
    wrongAnswers.length === 0;

  return {
    correctAnswers,
    wrongAnswers,
    missingAnswers,
    isPerfect,
  };
}