"use client";

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { QuestionBank } from '@/components/QuestionBank';
import { ExamPaper } from '@/components/ExamPaper';
import { QuestionGroupModal } from '@/components/QuestionGroupModal';
import { ExamSetupModal } from '@/components/ExamSetupModal';
import { useDashboard } from '@/context/DashboardContext';
import { QuestionGroup } from '@/types';
import { EvaluationDashboard } from '@/components/evaluation/EvaluationDashboard';

const DashboardContent = () => {
    const { updateQuestionGroup, questionGroups, currentView } = useDashboard();
    const [isSetupOpen, setIsSetupOpen] = useState(false);

    const [modalState, setModalState] = useState<{
        isOpen: boolean;
        type: 'MCQ' | 'Short Answer' | 'Creative';
        position: { x: number, y: number };
    }>({ isOpen: false, type: 'MCQ', position: { x: 0, y: 0 } });

    if (currentView === 'evaluation') {
        return <EvaluationDashboard />;
    }

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
                <ExamPaper
                    onOpenGroupSettings={handleOpenGroupSettings}
                    onOpenSetup={() => setIsSetupOpen(true)}
                />
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

            {isSetupOpen && (
                <ExamSetupModal onClose={() => setIsSetupOpen(false)} />
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
