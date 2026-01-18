"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { Question, QuestionGroup } from '@/types';

interface DashboardContextType {
  selectedQuestions: Question[];
  questionGroups: QuestionGroup[];
  selectedClass: string;
  selectedSubject: string;
  isSyncing: boolean;
  questionBank: Question[];
  isLoadingQuestions: boolean;
  addQuestion: (question: Question) => void;
  removeQuestion: (questionId: string) => void;
  updateQuestion: (questionId: string, updates: Partial<Question>) => void;
  reorderQuestions: (startIndex: number, endIndex: number) => void;
  updateQuestionGroup: (group: QuestionGroup) => void;
  setSelectedClass: (cls: string) => void;
  setSelectedSubject: (subject: string) => void;
  saveDraft: (data: { schoolName: string; examName: string; time: string; totalMarks: number }) => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [questionGroups, setQuestionGroups] = useState<QuestionGroup[]>([
    { id: 'g1', type: 'MCQ', marksPerQuestion: 1, totalToAnswer: 15, totalInGroup: 20 },
    { id: 'g2', type: 'Short Answer', marksPerQuestion: 5, totalToAnswer: 5, totalInGroup: 8 },
    { id: 'g3', type: 'Creative', marksPerQuestion: 10, totalToAnswer: 2, totalInGroup: 3 },
  ]);
  const [selectedClass, setSelectedClass] = useState<string>('class-10');
  const [selectedSubject, setSelectedSubject] = useState<string>('Math');
  const [isSyncing, setIsSyncing] = useState(false);

  // Backend Integration State
  const [questionBank, setQuestionBank] = useState<Question[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);

  // Fetch Questions from Backend
  useEffect(() => {
    const fetchQuestions = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/questions');
            setQuestionBank(response.data);
        } catch (error) {
            console.error('Failed to fetch questions:', error);
        } finally {
            setIsLoadingQuestions(false);
        }
    };
    fetchQuestions();
  }, []);

  const saveDraft = async (data: { schoolName: string; examName: string; time: string; totalMarks: number }) => {
    setIsSyncing(true);
    try {
        await axios.post('http://localhost:5000/api/exam-paper', {
            ...data,
            questions: selectedQuestions
        });
    } catch (error) {
        console.error('Failed to save draft:', error);
    } finally {
        setTimeout(() => setIsSyncing(false), 1000);
    }
  };

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

  const updateQuestionGroup = (group: QuestionGroup) => {
    setQuestionGroups((prev) => {
        const index = prev.findIndex(g => g.type === group.type);
        if (index >= 0) {
            const newGroups = [...prev];
            newGroups[index] = group;
            return newGroups;
        } else {
            return [...prev, group];
        }
    });
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
        isSyncing,
        questionBank,
        isLoadingQuestions,
        addQuestion,
        removeQuestion,
        updateQuestion,
        reorderQuestions,
        updateQuestionGroup,
        setSelectedClass,
        setSelectedSubject,
        saveDraft
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
