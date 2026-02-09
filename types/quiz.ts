import { Question } from "./question";

export type Quiz = {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  grade: string;
  duration: number; // minutes
  passingScore: number;
  totalScore: number;
  session: 'normal' | 'exam';
  isPublished: boolean;
  image?: string;
  user_id: string;
  createdAt: string;
  updatedAt: string;
  questions?: Question[];
};