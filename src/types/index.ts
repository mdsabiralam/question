export interface Question {
  id: string;
  title: string;
  subject: string;
  type: 'MCQ' | 'Short Answer' | 'Creative';
  marks: number;
}

export interface QuestionGroup {
  id: string;
  type: 'MCQ' | 'Short Answer' | 'Creative';
  marksPerQuestion: number;
  totalToAnswer: number;
  totalInGroup: number;
}
