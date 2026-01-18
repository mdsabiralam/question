"use client";

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { QuestionBank } from '@/components/QuestionBank';
import { ExamPaper } from '@/components/ExamPaper';
import { QuestionGroupModal } from '@/components/QuestionGroupModal';
import { ExamSetupModal } from '@/components/ExamSetupModal';
import { useDashboard } from '@/context/DashboardContext';
import { QuestionGroup, Question } from '@/types';
import {
    DndContext,
    DragOverlay,
    useSensor,
    useSensors,
    TouchSensor,
    PointerSensor,
    DragStartEvent,
    DragEndEvent,
    defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import { QuestionCard } from '@/components/QuestionCard';

const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5',
        },
      },
    }),
};

const DashboardContent = () => {
    const { updateQuestionGroup, questionGroups, addQuestion, reorderQuestions, selectedQuestions, sections } = useDashboard();
    const [isSetupOpen, setIsSetupOpen] = useState(false);
    const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 250,
                tolerance: 5,
            },
        })
    );

    const [modalState, setModalState] = useState<{
        isOpen: boolean;
        type: 'MCQ' | 'Short Answer' | 'Creative';
        position: { x: number, y: number };
    }>({ isOpen: false, type: 'MCQ', position: { x: 0, y: 0 } });

    const handleContextMenu = (e: React.MouseEvent, type?: 'MCQ' | 'Short Answer' | 'Creative') => {
        e.preventDefault();
        setModalState({
            isOpen: true,
            type: type || 'MCQ',
            position: { x: e.clientX, y: e.clientY }
        });
    };

    const handleOpenGroupSettings = (type: 'MCQ' | 'Short Answer' | 'Creative', e: React.MouseEvent) => {
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        setModalState({
            isOpen: true,
            type: type,
            position: { x: rect.left, y: rect.bottom + 10 }
        });
    };

    const handleSaveGroup = (group: QuestionGroup) => {
        updateQuestionGroup(group);
        setModalState(prev => ({ ...prev, isOpen: false }));
    };

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        if (active.data.current?.type === 'Question') {
            setActiveQuestion(active.data.current.question);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveQuestion(null);

        if (!over) return;

        // Dropping from Bank to Section
        if (active.id.toString().startsWith('bank-')) {
             const questionData = active.data.current?.question;
             if (!questionData) return;

             // Find target section
             // The over.id could be a specific question in a section or the section container itself
             let targetSectionId: string | undefined;

             // If dropped on a section container
             const sectionMatch = sections.find(s => s.id === over.id);
             if (sectionMatch) {
                 targetSectionId = sectionMatch.id;
             } else {
                 // If dropped on a question in a section, find that question's section
                 const targetQuestion = selectedQuestions.find(q => q.id === over.id);
                 if (targetQuestion) {
                     targetSectionId = targetQuestion.sectionId;
                 }
             }

             // Validate question type matches section type
             if (targetSectionId) {
                 const section = sections.find(s => s.id === targetSectionId);
                 if (section && section.questionType !== questionData.type) {
                     alert(`This section only accepts ${section.questionType} questions.`);
                     return;
                 }
                 addQuestion(questionData, targetSectionId);
             } else {
                 // Dropped somewhere else on paper, maybe add to default or prompt?
                 // For now, if no section is targeted, maybe just add to first available or ignore?
                 // Existing logic allowed adding without section if none found, but ExamPaper UI requires sections.
                 // Let's assume if sections exist, we must target one.
                 if (sections.length > 0) {
                     // Try to find if dropped on the paper container (if we add ID to it)
                     // Or just ignore if not on a valid target
                 } else {
                     // No sections yet
                     alert("Please create a section first.");
                 }
             }

        } else {
            // Reordering within paper
            if (active.id !== over.id) {
                const oldIndex = selectedQuestions.findIndex((q) => q.id === active.id);
                const newIndex = selectedQuestions.findIndex((q) => q.id === over.id);

                if (oldIndex !== -1 && newIndex !== -1) {
                     reorderQuestions(oldIndex, newIndex);
                }
            }
        }
    };

    return (
        <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            {/* Left Column: Question Bank (Source) */}
            <div className="lg:col-span-4 xl:col-span-3 h-[calc(100vh-theme(spacing.24))]">
                <QuestionBank />
            </div>

            {/* Right Column: Exam Paper Canvas (Target) */}
            <div
                className="lg:col-span-8 xl:col-span-9 h-[calc(100vh-theme(spacing.24))]"
                id="exam-paper-container"
                onContextMenu={(e) => handleContextMenu(e)}
            >
                <ExamPaper
                    onOpenGroupSettings={handleOpenGroupSettings}
                    onOpenSetup={() => setIsSetupOpen(true)}
                />
            </div>

            <DragOverlay dropAnimation={dropAnimation}>
                {activeQuestion ? <QuestionCard question={activeQuestion} /> : null}
            </DragOverlay>

            {modalState.isOpen && (
                <QuestionGroupModal
                    key={modalState.type}
                    type={modalState.type}
                    startPosition={modalState.position}
                    initialConfig={questionGroups.find(g => g.type === modalState.type)}
                    onTypeChange={(newType) => setModalState(prev => ({ ...prev, type: newType }))}
                    onSave={handleSaveGroup}
                    onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
                />
            )}

            {isSetupOpen && (
                <ExamSetupModal onClose={() => setIsSetupOpen(false)} />
            )}
        </DndContext>
    );
};

export default function Home() {
  return (
    <DashboardLayout>
        <DashboardContent />
    </DashboardLayout>
  );
}
