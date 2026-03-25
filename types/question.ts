export type QuestionType = 'MULTI_SELECT' | 'MCQ' | 'TRUE_FALSE' | 'SHORT_ANSWER';

export type Question = {
  _id: string;
  quizId: string;
  type: QuestionType; // future-proof (TF, SHORT, etc.)
  questionText: string;
  options: string[];
  points: number;
  order: number;
  timer: number | null;
  correctAnswer?:string[];
  createdAt: string;
  updatedAt: string;
};

export type Answer = {
    attemptId: string;
    questionId: string;
    studentAnswer: string[];

};