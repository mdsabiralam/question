import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';

export default function Home() {
  return (
    <DashboardLayout>
      {/* Left Column: Question Bank (Source) */}
      <div className="lg:col-span-4 xl:col-span-3 bg-white rounded-lg shadow-sm p-4 h-[calc(100vh-theme(spacing.24))] overflow-y-auto border border-gray-200">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Question Bank</h2>
        <div className="p-4 bg-gray-50 rounded border border-dashed border-gray-300 text-center text-gray-500">
          Source Panel (Phase 2)
        </div>
      </div>

      {/* Right Column: Exam Paper Canvas (Target) */}
      <div className="lg:col-span-8 xl:col-span-9 bg-gray-200 rounded-lg p-4 md:p-8 h-[calc(100vh-theme(spacing.24))] overflow-y-auto flex justify-center">
        <div className="w-full max-w-4xl bg-white min-h-[1000px] shadow-lg rounded-sm p-8 md:p-12 relative">
             <h2 className="text-xl font-bold mb-4 text-center">Exam Paper Canvas</h2>
             <div className="p-8 border border-dashed border-gray-300 text-center text-gray-500">
                Target Area (Phase 2)
             </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
