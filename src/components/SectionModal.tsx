"use client";

import React, { useState } from 'react';
import { Section, NumberingStyle } from '@/types';
import { toBengali } from '@/utils/helpers';
import { X, Calculator } from 'lucide-react';

interface SectionModalProps {
  initialConfig?: Section;
  onSave: (section: Section) => void;
  onClose: () => void;
}

export const SectionModal = ({ initialConfig, onSave, onClose }: SectionModalProps) => {
  const [title, setTitle] = useState(initialConfig?.title || '');
  const [questionType, setQuestionType] = useState<'MCQ' | 'Short Answer' | 'Creative'>(initialConfig?.questionType || 'MCQ');
  const [marksPerQuestion, setMarksPerQuestion] = useState(initialConfig?.marksPerQuestion || 1);
  const [questionsToAttempt, setQuestionsToAttempt] = useState(initialConfig?.questionsToAttempt || 1);
  const [totalQuestionsGiven, setTotalQuestionsGiven] = useState(initialConfig?.totalQuestionsGiven || 1);
  const [numberingStyle, setNumberingStyle] = useState<NumberingStyle>(initialConfig?.numberingStyle || 'bengali');
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    if (!title.trim()) {
        setError('Section title is required.');
        return;
    }
    if (questionsToAttempt > totalQuestionsGiven) {
      setError('To Answer cannot exceed Total Given.');
      return;
    }
    setError(null);
    onSave({
      id: initialConfig?.id || crypto.randomUUID(),
      title,
      questionType,
      marksPerQuestion,
      questionsToAttempt,
      totalQuestionsGiven,
      numberingStyle
    });
  };

  const totalMarks = marksPerQuestion * questionsToAttempt;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-800">Section Settings</h3>
            <button onClick={onClose}><X className="w-5 h-5 text-gray-500" /></button>
        </div>

        <div className="p-4 space-y-4">
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Section Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Section A: MCQ"
                    className="w-full border p-2 rounded"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Question Type</label>
                    <select
                        value={questionType}
                        onChange={(e) => setQuestionType(e.target.value as any)}
                        className="w-full border p-2 rounded"
                    >
                        <option value="MCQ">MCQ</option>
                        <option value="Short Answer">Short Answer</option>
                        <option value="Creative">Creative</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Serial Numbering</label>
                    <select
                        value={numberingStyle}
                        onChange={(e) => setNumberingStyle(e.target.value as NumberingStyle)}
                        className="w-full border p-2 rounded"
                    >
                        <option value="bengali">Bengali Numbers (১, ২, ৩)</option>
                        <option value="english">English Numbers (1, 2, 3)</option>
                        <option value="roman">Roman Numerals (i, ii, iii)</option>
                        <option value="bengali_alpha">Bengali Letters (ক, খ, গ)</option>
                        <option value="english_alpha">English Letters (a, b, c)</option>
                        <option value="bengali_vowel">Bengali Vowels (অ, আ, ই)</option>
                        <option value="bengali_1_alpha">Mixed: ১.ক, ১.খ...</option>
                        <option value="bengali_ka_1">Mixed: ক.১, ক.২...</option>
                        <option value="bengali_a_1">Mixed: অ.১, অ.২...</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Marks per Q</label>
                    <input
                        type="number" min="1"
                        value={marksPerQuestion}
                        onChange={(e) => setMarksPerQuestion(parseInt(e.target.value) || 0)}
                        className="w-full border p-2 rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Total Given</label>
                    <input
                        type="number" min="1"
                        value={totalQuestionsGiven}
                        onChange={(e) => setTotalQuestionsGiven(parseInt(e.target.value) || 0)}
                        className="w-full border p-2 rounded"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">To Attempt</label>
                <input
                    type="number" min="1"
                    value={questionsToAttempt}
                    onChange={(e) => setQuestionsToAttempt(parseInt(e.target.value) || 0)}
                    className="w-full border p-2 rounded"
                />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="bg-blue-50 p-3 rounded text-center border border-blue-100">
                <div className="flex items-center justify-center gap-2 text-blue-800 font-medium mb-1">
                    <Calculator className="w-4 h-4" />
                    <span className="text-xs uppercase">Calculated Marks</span>
                </div>
                <div className="text-xl font-bold text-blue-900">
                    {toBengali(marksPerQuestion)} × {toBengali(questionsToAttempt)} = {toBengali(totalMarks)}
                </div>
            </div>
        </div>

        <div className="p-4 border-t border-gray-100 flex justify-end gap-2">
            <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save Section</button>
        </div>
      </div>
    </div>
  );
};
