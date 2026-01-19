export type BlockType = 'Text' | 'Math' | 'Image' | 'AnswerSpace' | 'Drawing';

export interface Block {
  id: string;
  type: BlockType;
  content: any;
}

export interface TextBlockContent {
  text: string;
}

export interface MathBlockContent {
  top: string;
  bottom: string;
  operator: '+' | '-' | '×' | '÷';
}

export interface ImageBlockContent {
  url: string;
  caption?: string;
}

export interface DrawingBlockContent {
  dataUrl: string; // Base64 image
  canvasData?: string; // Serialized canvas data for editing
}

export interface AnswerSpaceContent {
  type: 'Lines' | 'Box';
  count?: number;
  height?: string;
}

export interface Question {
  id: string;
  title: string;
  blocks?: Block[];
  answer?: string;
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
