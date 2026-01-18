"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { Question, QuestionGroup, Section, ExamMeta } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface DashboardContextType {
  selectedQuestions: Question[];
  questionGroups: QuestionGroup[];
  sections: Section[];
  examTypes: string[];
  selectedClass: string;
  selectedSubject: string;
  isSyncing: boolean;
  questionBank: Question[];
  isLoadingQuestions: boolean;
  examMeta: ExamMeta;
  currentView: 'builder' | 'evaluation';
  setExamMeta: React.Dispatch<React.SetStateAction<ExamMeta>>;
  setCurrentView: (view: 'builder' | 'evaluation') => void;
  addQuestion: (question: Question, sectionId?: string) => void;
  removeQuestion: (questionId: string) => void;
  updateQuestion: (questionId: string, updates: Partial<Question>) => void;
  reorderQuestions: (startIndex: number, endIndex: number) => void;
  updateQuestionGroup: (group: QuestionGroup) => void;
  addSection: (section: Section) => void;
  updateSection: (section: Section) => void;
  removeSection: (sectionId: string) => void;
  reorderSections: (startIndex: number, endIndex: number) => void;
  addExamType: (type: string) => void;
  updateExamType: (oldType: string, newType: string) => void;
  removeExamType: (type: string) => void;
  setSelectedClass: (cls: string) => void;
  setSelectedSubject: (subject: string) => void;
  saveDraft: (data: any) => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

const DEFAULT_EXAM_TYPES = [
  'Weekly Test',
  'Monthly Test',
  'Class Test',
  'First Terminal',
  'Second Terminal',
  'Annual Exam'
];

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [questionGroups, setQuestionGroups] = useState<QuestionGroup[]>([
    { id: 'g1', type: 'MCQ', marksPerQuestion: 1, totalToAnswer: 15, totalInGroup: 20 },
    { id: 'g2', type: 'Short Answer', marksPerQuestion: 5, totalToAnswer: 5, totalInGroup: 8 },
    { id: 'g3', type: 'Creative', marksPerQuestion: 10, totalToAnswer: 2, totalInGroup: 3 },
  ]);

  const [sections, setSections] = useState<Section[]>([]);
  const [examTypes, setExamTypes] = useState<string[]>(DEFAULT_EXAM_TYPES);
  const [currentView, setCurrentView] = useState<'builder' | 'evaluation'>('builder');

  const [selectedClass, setSelectedClass] = useState<string>('class-10');
  const [selectedSubject, setSelectedSubject] = useState<string>('Math');
  const [isSyncing, setIsSyncing] = useState(false);

  const [examMeta, setExamMeta] = useState<ExamMeta>({
      schoolName: 'Govt. High School',
      examName: 'Half Yearly Exam 2024',
      examType: 'Annual Exam',
      time: '2 Hours 30 Minutes',
      declaredTotalMarks: 100,
      board: 'WB'
  });

  const [questionBank, setQuestionBank] = useState<Question[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);

  useEffect(() => {
      if (typeof window !== 'undefined') {
          const saved = localStorage.getItem('examBuilderDraft');
          if (saved) {
              try {
                  const parsed = JSON.parse(saved);
                  if (parsed.selectedQuestions) setSelectedQuestions(parsed.selectedQuestions);
                  if (parsed.examMeta) setExamMeta(parsed.examMeta);
                  if (parsed.sections) setSections(parsed.sections);
                  if (parsed.examTypes) setExamTypes(parsed.examTypes);
              } catch (e) {
                  console.error("Failed to parse draft", e);
              }
          }
      }
  }, []);

  useEffect(() => {
      if (typeof window !== 'undefined') {
          localStorage.setItem('examBuilderDraft', JSON.stringify({
              selectedQuestions,
              examMeta,
              sections,
              examTypes
          }));
      }
  }, [selectedQuestions, examMeta, sections, examTypes]);

  useEffect(() => {
    const fetchQuestions = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/questions`);
            setQuestionBank(response.data);
        } catch (error) {
            console.error('Failed to fetch questions:', error);
        } finally {
            setIsLoadingQuestions(false);
        }
    };
    fetchQuestions();
  }, []);

  const saveDraft = async (data: any) => {
    setIsSyncing(true);
    try {
        await axios.post(`${API_URL}/api/exam-paper`, {
            ...data,
            questions: selectedQuestions,
            sections
        });
    } catch (error) {
        console.error('Failed to save draft:', error);
    } finally {
        setTimeout(() => setIsSyncing(false), 1000);
    }
  };

  const addQuestion = (question: Question, sectionId?: string) => {
    const newQ = { ...question, sectionId };
    setSelectedQuestions((prev) => [...prev, newQ]);
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

  const addSection = (section: Section) => {
      setSections(prev => [...prev, section]);
  };

  const updateSection = (section: Section) => {
      setSections(prev => prev.map(s => s.id === section.id ? section : s));
  };

  const removeSection = (sectionId: string) => {
      setSections(prev => prev.filter(s => s.id !== sectionId));
      setSelectedQuestions(prev => prev.filter(q => q.sectionId !== sectionId));
  };

  const reorderSections = (startIndex: number, endIndex: number) => {
      setSections(prev => {
          const result = Array.from(prev);
          const [removed] = result.splice(startIndex, 1);
          result.splice(endIndex, 0, removed);
          return result;
      });
  };

  const addExamType = (type: string) => setExamTypes(prev => [...prev, type]);
  const updateExamType = (oldType: string, newType: string) => setExamTypes(prev => prev.map(t => t === oldType ? newType : t));
  const removeExamType = (type: string) => setExamTypes(prev => prev.filter(t => t !== type));

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

  return (
    <DashboardContext.Provider
      value={{
        selectedQuestions,
        questionGroups,
        sections,
        examTypes,
        selectedClass,
        selectedSubject,
        isSyncing,
        questionBank,
        isLoadingQuestions,
        examMeta,
        currentView,
        setExamMeta,
        setCurrentView,
        addQuestion,
        removeQuestion,
        updateQuestion,
        reorderQuestions,
        updateQuestionGroup,
        addSection,
        updateSection,
        removeSection,
        reorderSections,
        addExamType,
        updateExamType,
        removeExamType,
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
