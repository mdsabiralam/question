import { Question } from '@/types';

export const draftQuestions: Question[] = [
  {
    id: 'q1',
    title: 'What is the capital of Bangladesh?',
    subject: 'General Knowledge',
    type: 'MCQ',
    marks: 1,
  },
  {
    id: 'q2',
    title: 'Explain the theory of relativity.',
    subject: 'Science',
    type: 'Short Answer',
    marks: 5,
  },
  {
    id: 'q3',
    title: 'Solve for x: 2x + 5 = 15',
    subject: 'Math',
    type: 'Short Answer',
    marks: 3,
  },
  {
    id: 'q4',
    title: 'Write a poem about rain.',
    subject: 'Bengali',
    type: 'Creative',
    marks: 10,
  },
  {
    id: 'q5',
    title: 'Who wrote Gitanjali?',
    subject: 'Bengali',
    type: 'MCQ',
    marks: 1,
  },
];
