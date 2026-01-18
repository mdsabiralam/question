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
  DragOverEvent,
  DragEndEvent,
  defaultDropAnimationSideEffects,
  DropAnimation
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { QuestionCard } from '@/components/QuestionCard'; // We'll use this for overlay

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5',
      },
    },
  }),
};

const DashboardContent = () => {
    const {
        updateQuestionGroup,
        questionGroups,
        selectedQuestions,
        addQuestion,
        reorderQuestions
    } = useDashboard();

    // Dnd State
    const [activeId, setActiveId] = useState<string | null>(null);
    const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);

    // Sensors
    // Critical: Activation constraints for TouchSensor to allow scrolling/tapping vs dragging
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // Requires 5px movement to start drag (prevents accidental clicks)
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 250, // 250ms press to drag (allows scrolling otherwise)
                tolerance: 5, // 5px tolerance during the delay
            },
        })
    );

    const [modalState, setModalState] = useState<{
        isOpen: boolean;
        type: 'MCQ' | 'Short Answer' | 'Creative';
        position: { x: number, y: number };
    }>({ isOpen: false, type: 'MCQ', position: { x: 0, y: 0 } });

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        setActiveId(active.id as string);

        // Determine what is being dragged
        if (active.data.current?.question) {
             setActiveQuestion(active.data.current.question);
        } else {
             // If dragging internal sortable item, find it in selectedQuestions
             const q = selectedQuestions.find(q => q.id === active.id);
             if (q) setActiveQuestion(q);
        }
    };

    const handleDragOver = (event: DragOverEvent) => {
         // Could handle visual cues here, but usually not strictly necessary if logic is in DragEnd
         // or if we use SortableContext which handles local reordering visual previews automatically.
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        setActiveId(null);
        setActiveQuestion(null);

        if (!over) return;

        const activeIdStr = String(active.id);
        const overIdStr = String(over.id);

        // Case 1: Dragging from QuestionBank (source: 'bank') to ExamPaper
        if (activeIdStr.startsWith('bank-')) {
            // Check if dropped on Exam Paper (or any item inside it)
            // The droppable container has id 'exam-paper'.
            // Items inside have regular ids.
            // Basically if 'over' exists, and we are dragging a bank item, we try to add it.

            const questionToAdd = active.data.current?.question as Question;
            if (questionToAdd) {
                // Check if already exists
                if (!selectedQuestions.some(q => q.id === questionToAdd.id)) {
                    addQuestion(questionToAdd);
                }
            }
            return;
        }

        // Case 2: Reordering within ExamPaper
        if (activeIdStr !== overIdStr) {
            const oldIndex = selectedQuestions.findIndex(q => q.id === activeIdStr);
            const newIndex = selectedQuestions.findIndex(q => q.id === overIdStr);

            if (oldIndex !== -1 && newIndex !== -1) {
                reorderQuestions(oldIndex, newIndex);
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
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
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

            <DragOverlay dropAnimation={dropAnimation}>
                {activeId && activeQuestion ? (
                     <div className="opacity-90 rotate-2 scale-105 cursor-grabbing">
                        <QuestionCard question={activeQuestion} />
                     </div>
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
