"use client";

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { QuestionBank } from '@/components/QuestionBank';
import { ExamPaper } from '@/components/ExamPaper';
import { QuestionGroupModal } from '@/components/QuestionGroupModal';
import { useDashboard } from '@/context/DashboardContext';
import { QuestionGroup } from '@/types';

// We need a wrapper to access context for saving, but Home is a Server Component by default in Next 13+ unless "use client"
// But page.tsx already has "use client".
// However, we need to pass `updateQuestionGroup` to Modal.
// We also need to state for modal.

const DashboardContent = () => {
    const { updateQuestionGroup, questionGroups } = useDashboard();

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

    const handleSaveGroup = (group: QuestionGroup) => {
        updateQuestionGroup(group);
        setModalState(prev => ({ ...prev, isOpen: false }));
    };

    return (
        <>
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
                <ExamPaper />
            </div>

            {modalState.isOpen && (
                <QuestionGroupModal
                    type={modalState.type}
                    startPosition={modalState.position}
                    initialConfig={questionGroups.find(g => g.type === modalState.type)}
                    onSave={handleSaveGroup}
                    onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
                />
            )}
        </>
    );
};

export default function Home() {
  return (
    <DashboardLayout>
        <DashboardContent />
    </DashboardLayout>
  );
}
