"use client";

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { QuestionBank } from '@/components/QuestionBank';
import { ExamPaper } from '@/components/ExamPaper';
import { QuestionGroupModal } from '@/components/QuestionGroupModal';
import { useDashboard } from '@/context/DashboardContext';
import { QuestionGroup, Question } from '@/types';
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
  DragStartEvent,
  DragEndEvent,
  closestCorners
} from '@dnd-kit/core';
import { QuestionCard, QuestionCardView } from '@/components/QuestionCard';
import { SortableExamItem } from '@/components/SortableExamItem';

const DashboardContent = () => {
    const { updateQuestionGroup, questionGroups, addQuestion, selectedQuestions, reorderQuestions } = useDashboard();

    const [modalState, setModalState] = useState<{
        isOpen: boolean;
        type: 'MCQ' | 'Short Answer' | 'Creative';
        position: { x: number, y: number };
    }>({ isOpen: false, type: 'MCQ', position: { x: 0, y: 0 } });

    // Drag and Drop State
    const [activeId, setActiveId] = useState<string | null>(null);
    const [activeItem, setActiveItem] = useState<any>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(TouchSensor, {
            // Press delay of 250ms, with tolerance of 5px of movement
            activationConstraint: {
                delay: 250,
                tolerance: 5,
            },
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        setActiveId(active.id as string);
        setActiveItem(active.data.current);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);
        setActiveItem(null);

        if (!over) return;

        const activeData = active.data.current;
        const source = activeData?.source;

        // Case 1: Dragging from Question Bank to Paper
        if (source === 'bank' && activeData && activeData.question) {
            // Check if dropped over the paper or any question in the paper
            const isOverPaper = over.id === 'exam-paper' || selectedQuestions.some(q => q.id === over.id);

            if (isOverPaper) {
                const questionToAdd = activeData.question as Question;
                const isAlreadyAdded = selectedQuestions.some(q => q.id === questionToAdd.id);

                if (!isAlreadyAdded) {
                    addQuestion(questionToAdd);
                }
            }
        }
        // Case 2: Reordering within Paper
        else if (source === 'paper') {
             if (active.id !== over.id) {
                const oldIndex = selectedQuestions.findIndex(q => q.id === active.id);
                const newIndex = selectedQuestions.findIndex(q => q.id === over.id);

                if (oldIndex !== -1 && newIndex !== -1) {
                    reorderQuestions(oldIndex, newIndex);
                }
             }
        }
    };

    const handleContextMenu = (e: React.MouseEvent, type?: 'MCQ' | 'Short Answer' | 'Creative') => {
        e.preventDefault();
        setModalState({
            isOpen: true,
            type: type || 'MCQ',
            position: { x: e.clientX, y: e.clientY }
        });
    };

    const handleOpenGroupSettings = (type: 'MCQ' | 'Short Answer' | 'Creative', e: React.MouseEvent) => {
        // Position relative to the button
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

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
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
                <ExamPaper onOpenGroupSettings={handleOpenGroupSettings} />
            </div>

            {modalState.isOpen && (
                <QuestionGroupModal
                    key={modalState.type} // Force re-render when type changes to reset form state
                    type={modalState.type}
                    startPosition={modalState.position}
                    initialConfig={questionGroups.find(g => g.type === modalState.type)}
                    onTypeChange={(newType) => setModalState(prev => ({ ...prev, type: newType }))}
                    onSave={handleSaveGroup}
                    onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
                />
            )}

            <DragOverlay>
                {activeId && activeItem ? (
                    activeItem.type === 'Question' ? (
                        <div className="w-[300px]">
                            <QuestionCardView question={activeItem.question} isOverlay />
                        </div>
                    ) : activeItem.type === 'ExamQuestion' ? (
                        <div className="w-[600px]">
                             {/* Simplified overlay for exam item */}
                             <SortableExamItem
                                question={activeItem.question}
                                serial="" // No serial in overlay or maybe handle it if we passed it?
                                onRemove={() => {}}
                                onUpdate={() => {}}
                                isOverlay
                            />
                        </div>
                    ) : null
                ) : null}
            </DragOverlay>
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
