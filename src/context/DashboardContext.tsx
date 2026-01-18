"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { Question, QuestionGroup, ClassStructure } from '@/types';
import { INITIAL_CLASSES, INITIAL_QUESTION_TYPES } from '@/data/preloadedData';

interface ExamMeta {
    schoolName: string;
    examName: string;
    time: string;
}

interface DashboardContextType {
  selectedQuestions: Question[];
  questionGroups: QuestionGroup[];
  selectedClass: string;
  selectedSubject: string;
  isSyncing: boolean;
  questionBank: Question[];
  isLoadingQuestions: boolean;
  examMeta: ExamMeta;
  setExamMeta: React.Dispatch<React.SetStateAction<ExamMeta>>;

  // New States
  classes: ClassStructure[];
  questionTypes: string[];
  isSettingsOpen: boolean;
  setIsSettingsOpen: (isOpen: boolean) => void;

  // Actions
  addQuestion: (question: Question) => void;
  removeQuestion: (questionId: string) => void;
  updateQuestion: (questionId: string, updates: Partial<Question>) => void;
  reorderQuestions: (startIndex: number, endIndex: number) => void;
  updateQuestionGroup: (group: QuestionGroup) => void;
  setSelectedClass: (cls: string) => void;
  setSelectedSubject: (subject: string) => void;
  saveDraft: (data: { schoolName: string; examName: string; time: string; totalMarks: number }) => Promise<void>;

  // Settings Actions
  addClass: (cls: ClassStructure) => void;
  updateClass: (id: string, updates: Partial<ClassStructure>) => void;
  deleteClass: (id: string) => void;
  addSubject: (classId: string, subject: string) => void;
  deleteSubject: (classId: string, subject: string) => void;
  addQuestionType: (type: string) => void;
  deleteQuestionType: (type: string) => void;
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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // New Global State
  const [classes, setClasses] = useState<ClassStructure[]>(INITIAL_CLASSES);
  const [questionTypes, setQuestionTypes] = useState<string[]>(INITIAL_QUESTION_TYPES);

  // Exam Meta State
  const [examMeta, setExamMeta] = useState<ExamMeta>({
      schoolName: 'Govt. High School',
      examName: 'Half Yearly Exam 2024',
      time: '2 Hours 30 Minutes'
  });

  // Backend Integration State
  const [questionBank, setQuestionBank] = useState<Question[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);

  // Persistence Logic
  useEffect(() => {
      if (typeof window !== 'undefined') {
          // Load Draft
          const savedDraft = localStorage.getItem('examBuilderDraft');
          if (savedDraft) {
              try {
                  const parsed = JSON.parse(savedDraft);
                  if (parsed.selectedQuestions) setSelectedQuestions(parsed.selectedQuestions);
                  if (parsed.examMeta) setExamMeta(parsed.examMeta);
              } catch (e) {
                  console.error("Failed to parse draft", e);
              }
          }

          // Load Settings
          const savedSettings = localStorage.getItem('examBuilderSettings');
          if (savedSettings) {
              try {
                  const parsed = JSON.parse(savedSettings);
                  if (parsed.classes) setClasses(parsed.classes);
                  if (parsed.questionTypes) setQuestionTypes(parsed.questionTypes);
              } catch (e) {
                  console.error("Failed to parse settings", e);
              }
          }
      }
  }, []);

  useEffect(() => {
      if (typeof window !== 'undefined') {
          localStorage.setItem('examBuilderDraft', JSON.stringify({
              selectedQuestions,
              examMeta
          }));
      }
  }, [selectedQuestions, examMeta]);

  useEffect(() => {
      if (typeof window !== 'undefined') {
          localStorage.setItem('examBuilderSettings', JSON.stringify({
              classes,
              questionTypes
          }));
      }
  }, [classes, questionTypes]);

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
    // Add to bank (local only for now, ideally post to backend)
    setQuestionBank(prev => [question, ...prev]);
    // Also select it? Maybe not.
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

  // Settings CRUD
  const addClass = (cls: ClassStructure) => setClasses(prev => [...prev, cls]);
  const updateClass = (id: string, updates: Partial<ClassStructure>) => {
      setClasses(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };
  const deleteClass = (id: string) => setClasses(prev => prev.filter(c => c.id !== id));

  const addSubject = (classId: string, subject: string) => {
      setClasses(prev => prev.map(c => {
          if (c.id === classId && !c.subjects.includes(subject)) {
              return { ...c, subjects: [...c.subjects, subject] };
          }
          return c;
      }));
  };

  const deleteSubject = (classId: string, subject: string) => {
      setClasses(prev => prev.map(c => {
          if (c.id === classId) {
              return { ...c, subjects: c.subjects.filter(s => s !== subject) };
          }
          return c;
      }));
  };

  const addQuestionType = (type: string) => setQuestionTypes(prev => [...prev, type]);
  const deleteQuestionType = (type: string) => setQuestionTypes(prev => prev.filter(t => t !== type));

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
        examMeta,
        setExamMeta,
        classes,
        questionTypes,
        isSettingsOpen,
        setIsSettingsOpen,
        addQuestion,
        removeQuestion,
        updateQuestion,
        reorderQuestions,
        updateQuestionGroup,
        setSelectedClass,
        setSelectedSubject,
        saveDraft,
        addClass,
        updateClass,
        deleteClass,
        addSubject,
        deleteSubject,
        addQuestionType,
        deleteQuestionType
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
