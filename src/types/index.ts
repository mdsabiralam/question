export interface Question {
  id: string;
  title: string;
  subject: string;
  type: string;
  marks: number;
  class: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
}

export interface ClassStructure {
  id: string;
  name: string;
  subjects: string[];
}

export interface QuestionGroup {
  id: string;
  type: 'MCQ' | 'Short Answer' | 'Creative';
  marksPerQuestion: number;
  totalToAnswer: number;
  totalInGroup: number;
}
