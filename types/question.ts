export type QuestionType = 'MCQ' | 'TRUE_FALSE' | 'SHORT_ANSWER';

export type Question = {
  _id: string;
  quizId: string;
  type: QuestionType; // future-proof (TF, SHORT, etc.)
  questionText: string;
  options: string[];
  points: number;
  order: number;
  timer: number | null;
  createdAt: string;
  updatedAt: string;
};
