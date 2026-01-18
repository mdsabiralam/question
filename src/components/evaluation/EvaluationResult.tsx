"use client";

import React from 'react';
import { Question } from '@/types';
import { AIAnalysis } from '@/utils/aiEvaluation';
import { Bot, User, CheckCircle } from 'lucide-react';

interface EvaluationResultProps {
    question: Question;
    studentAnswer: string;
    analysis: AIAnalysis | null;
    marks: number;
    feedback: string;
    onMarksChange: (m: number) => void;
    onFeedbackChange: (f: string) => void;
}

export const EvaluationResult = ({
    question, studentAnswer, analysis, marks, feedback, onMarksChange, onFeedbackChange
}: EvaluationResultProps) => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded border">
                    <h4 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <User className="w-4 h-4" /> Student Answer
                    </h4>
                    <p className="text-sm text-gray-800 whitespace-pre-wrap">{studentAnswer || "(No answer)"}</p>
                </div>
                <div className="p-4 bg-blue-50 rounded border border-blue-100">
                    <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" /> Model Answer
                    </h4>
                    <p className="text-sm text-blue-900 whitespace-pre-wrap">{question.answer || "(No model answer provided)"}</p>
                </div>
            </div>

            {analysis && (
                <div className="bg-purple-50 p-4 rounded border border-purple-100">
                    <h4 className="font-bold text-purple-800 mb-2 flex items-center gap-2">
                        <Bot className="w-4 h-4" /> AI Suggestion
                    </h4>
                    <div className="flex gap-4 mb-2 text-sm">
                        <span className="font-semibold">Suggested Marks: <span className="text-purple-700">{analysis.suggestedMarks} / {question.marks}</span></span>
                    </div>
                    <p className="text-sm text-purple-900 italic">"{analysis.feedback}"</p>
                </div>
            )}

            <div className="p-4 border rounded bg-white shadow-sm">
                <h4 className="font-bold text-gray-800 mb-4 border-b pb-2">Final Evaluation (Teacher's Decision)</h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Marks Awarded</label>
                        <input
                            type="number"
                            max={question.marks}
                            min={0}
                            value={marks}
                            onChange={(e) => onMarksChange(Number(e.target.value))}
                            className="w-full p-2 border rounded font-bold text-lg"
                        />
                        <span className="text-xs text-gray-500">Out of {question.marks}</span>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Feedback to Student</label>
                    <textarea
                        value={feedback}
                        onChange={(e) => onFeedbackChange(e.target.value)}
                        className="w-full h-24 p-2 border rounded"
                        placeholder="Write feedback..."
                    />
                </div>
            </div>
        </div>
    );
};
