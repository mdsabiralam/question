"use client";

import React, { forwardRef } from 'react';
import { Section, Question, ExamMeta } from '@/types';
import { formatSerial, toBengali } from '@/utils/helpers';

interface PrintableAnswerKeyProps {
    examMeta: ExamMeta;
    sections: Section[];
    questions: Question[];
}

export const PrintableAnswerKey = forwardRef<HTMLDivElement, PrintableAnswerKeyProps>(({ examMeta, sections, questions }, ref) => {
    return (
        <div ref={ref} className="bg-white p-12 w-[210mm] min-h-[297mm] mx-auto text-black">
            {/* Header */}
            <div className="text-center mb-8 border-b-2 border-gray-800 pb-4">
                <h1 className="text-2xl font-bold mb-2">{examMeta.schoolName} - Answer Key</h1>
                <div className="flex justify-center gap-4 mt-2 font-semibold">
                    <span>{examMeta.examType}</span>
                    <span>{examMeta.examName}</span>
                </div>
            </div>

            {/* Sections */}
            <div className="space-y-8">
                {sections.map((section, sIdx) => {
                    const sectionQuestions = questions.filter(q => q.sectionId === section.id);
                    if (sectionQuestions.length === 0) return null;

                    return (
                        <div key={section.id}>
                            <h3 className="text-lg font-bold underline mb-3">{section.title}</h3>
                            <div className="space-y-4">
                                {sectionQuestions.map((q, qIdx) => (
                                    <div key={q.id} className="flex gap-3 border-b border-dashed border-gray-200 pb-2">
                                        <span className="font-bold min-w-[24px]">
                                            {formatSerial(qIdx, section.numberingStyle)}.
                                        </span>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-700 mb-1 line-clamp-1">{q.title}</p>
                                            <div className="text-sm">
                                                <span className="font-bold text-green-700">Ans: </span>
                                                {q.answer ? (
                                                    <span className="whitespace-pre-wrap">{q.answer}</span>
                                                ) : (
                                                    <span className="italic text-gray-400">No answer provided</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
});

PrintableAnswerKey.displayName = "PrintableAnswerKey";
