"use client";

import React from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { X, CheckCircle, AlertCircle, FileCheck } from 'lucide-react';
import clsx from 'clsx';

interface PreviewModalProps {
  onClose: () => void;
  schoolName: string; // Passed from parent or valid check
}

export const PreviewModal = ({ onClose, schoolName }: PreviewModalProps) => {
  const { selectedQuestions, questionGroups } = useDashboard();

  // Validation Logic
  const validations = [
    {
      id: 'school',
      label: 'School Name Set',
      isValid: schoolName.trim().length > 0 && schoolName !== 'School Name',
      error: 'School Name is missing or default.'
    },
    {
      id: 'questions',
      label: 'Questions Added',
      isValid: selectedQuestions.length > 0,
      error: 'No questions added to the paper.'
    },
    ...questionGroups.map(g => {
        const count = selectedQuestions.filter(q => q.type === g.type).length;
        return {
            id: `group-${g.type}`,
            label: `${g.type} Group Config`,
            isValid: count >= g.totalToAnswer, // Simple rule: must have enough questions to answer? Or just checking config match?
            // Prompt 13: "check if the total questions in a group match the configuration (e.g., 'Expected 5 questions, found 3')"
            // Usually we need at least totalToAnswer questions available.
            error: `Expected at least ${g.totalToAnswer} ${g.type} questions, found ${count}.`
        };
    })
  ];

  const allValid = validations.every(v => v.isValid);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-blue-600" />
                Paper Validation & Preview
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
            </button>
        </div>

        <div className="p-6 overflow-y-auto">
            {allValid ? (
                <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-green-700 mb-2">Paper is Valid!</h3>
                    <p className="text-gray-600">All checks passed. You are ready to print or save.</p>
                </div>
            ) : (
                <div>
                    <div className="mb-4 flex items-center gap-2 text-red-600 font-semibold bg-red-50 p-3 rounded">
                        <AlertCircle className="w-5 h-5" />
                        <span>Please fix the following issues:</span>
                    </div>
                    <ul className="space-y-3">
                        {validations.map((v) => (
                            <li key={v.id} className="flex items-start gap-3 p-3 border rounded-lg">
                                {v.isValid ? (
                                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                                ) : (
                                    <X className="w-5 h-5 text-red-500 mt-0.5" />
                                )}
                                <div>
                                    <p className={clsx("font-medium", v.isValid ? "text-gray-700" : "text-red-700")}>
                                        {v.label}
                                    </p>
                                    {!v.isValid && (
                                        <p className="text-sm text-red-600 mt-1">{v.error}</p>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>

        <div className="p-4 bg-gray-50 border-t flex justify-end">
            <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-medium"
            >
                Close
            </button>
        </div>
      </div>
    </div>
  );
};
