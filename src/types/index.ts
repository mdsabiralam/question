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
  answer?: string; // Model answer
}

export interface QuestionGroup {
  id: string;
  type: 'MCQ' | 'Short Answer' | 'Creative';
  marksPerQuestion: number;
  totalToAnswer: number;
  totalInGroup: number;
}

export type BoardType = 'WB' | 'CBSE' | 'Custom';
export type NumberingStyle = 'bengali' | 'english' | 'roman' | 'bengali_alpha' | 'english_alpha';

export interface ExamMeta {
    schoolName: string;
    examName: string;
    examType: string;
    time: string;
    declaredTotalMarks: number;
    board?: BoardType;
}

export interface Section {
  id: string;
  title: string;
  questionType: 'MCQ' | 'Short Answer' | 'Creative';
  questionsToAttempt: number;
  marksPerQuestion: number;
  totalQuestionsGiven: number;
  numberingStyle?: NumberingStyle;
}
