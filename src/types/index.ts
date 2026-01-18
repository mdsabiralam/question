export type BlockType = 'text' | 'math' | 'image' | 'answer_space';

export interface MathBlockContent {
  latex: string;
  mode: 'latex' | 'visual';
  visualData?: {
    top: string;
    bottom: string;
    operator: '+' | '-' | '×' | '÷';
  };
}

export interface ImageBlockContent {
  url: string;
  caption?: string;
}

export interface AnswerSpaceContent {
  type: 'line' | 'box';
  count?: number; // for lines
  height?: string; // for box
}

export interface QuestionBlock {
  id: string;
  type: BlockType;
  content: string | MathBlockContent | ImageBlockContent | AnswerSpaceContent;
}

export interface Question {
  id: string;
  title: string;
  subject: string;
  type: 'MCQ' | 'Short Answer' | 'Creative';
  marks: number;
  class: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  sectionId?: string;
  blocks?: QuestionBlock[];
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
