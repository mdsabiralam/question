export interface Question {
  id: string;
  title: string;
  subject: string;
  type: 'MCQ' | 'Short Answer' | 'Creative';
  marks: number;
  class: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  sectionId?: string;
}

export interface QuestionGroup {
  id: string;
  type: 'MCQ' | 'Short Answer' | 'Creative';
  marksPerQuestion: number;
  totalToAnswer: number;
  totalInGroup: number;
}

export interface Section {
  id: string;
  title: string;
  questionType: 'MCQ' | 'Short Answer' | 'Creative';
  questionsToAttempt: number;
  marksPerQuestion: number;
}
