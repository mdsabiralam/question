"use client";

import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { QuestionBank } from '@/components/QuestionBank';
import { ExamPaper } from '@/components/ExamPaper';

export default function Home() {
  return (
    <DashboardLayout>
      {/* Left Column: Question Bank (Source) */}
      <div className="lg:col-span-4 xl:col-span-3 h-[calc(100vh-theme(spacing.24))]">
        <QuestionBank />
      </div>

      {/* Right Column: Exam Paper Canvas (Target) */}
      <div className="lg:col-span-8 xl:col-span-9 h-[calc(100vh-theme(spacing.24))]">
        <ExamPaper />
      </div>
    </DashboardLayout>
  );
}
