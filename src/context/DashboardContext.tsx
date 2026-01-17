"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Question, QuestionGroup } from '@/types';

interface DashboardContextType {
  selectedQuestions: Question[];
  questionGroups: QuestionGroup[];
  selectedClass: string;
  selectedSubject: string;
  addQuestion: (question: Question) => void;
  removeQuestion: (questionId: string) => void;
  updateQuestion: (questionId: string, updates: Partial<Question>) => void;
  reorderQuestions: (startIndex: number, endIndex: number) => void;
  setSelectedClass: (cls: string) => void;
  setSelectedSubject: (subject: string) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [questionGroups, setQuestionGroups] = useState<QuestionGroup[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('class-10');
  const [selectedSubject, setSelectedSubject] = useState<string>('Math');

  const addQuestion = (question: Question) => {
    setSelectedQuestions((prev) => [...prev, question]);
  };

  const removeQuestion = (questionId: string) => {
    setSelectedQuestions((prev) => prev.filter((q) => q.id !== questionId));
  };

  const updateQuestion = (questionId: string, updates: Partial<Question>) => {
    setSelectedQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, ...updates } : q))
    );
  };

  const reorderQuestions = (startIndex: number, endIndex: number) => {
    setSelectedQuestions((prev) => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  };

  return (
    <DashboardContext.Provider
      value={{
        selectedQuestions,
        questionGroups,
        selectedClass,
        selectedSubject,
        addQuestion,
        removeQuestion,
        updateQuestion,
        reorderQuestions,
        setSelectedClass,
        setSelectedSubject,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
