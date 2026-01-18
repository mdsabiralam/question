import React, { useState, useEffect } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { X, Save, ArrowRight, ArrowLeft } from 'lucide-react';
import { toBengali } from '@/utils/helpers';

interface QuestionCreatorProps {
  onClose: () => void;
}

export const QuestionCreator = ({ onClose }: QuestionCreatorProps) => {
  const { classes, questionTypes, addQuestion, selectedClass: contextSelectedClass, selectedSubject: contextSelectedSubject } = useDashboard();

  // Step 1: Class
  const [selectedClassId, setSelectedClassId] = useState(contextSelectedClass || classes[0]?.id || '');

  // Step 2: Subject
  const [selectedSubject, setSelectedSubject] = useState(contextSelectedSubject || '');

  // Step 3: Type
  const [selectedType, setSelectedType] = useState(questionTypes[0] || '');

  // Step 4: Details
  const [questionTitle, setQuestionTitle] = useState('');
  const [questionMarks, setQuestionMarks] = useState(1);
  const [questionDifficulty, setQuestionDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');

  const [step, setStep] = useState(1);

  // Derived state
  const currentClass = classes.find(c => c.id === selectedClassId);
  const availableSubjects = currentClass ? currentClass.subjects : [];

  // Reset subject if class changes
  useEffect(() => {
    if (currentClass && !currentClass.subjects.includes(selectedSubject)) {
        setSelectedSubject(currentClass.subjects[0] || '');
    }
  }, [selectedClassId, currentClass]);

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSave = () => {
    if (!questionTitle) return;

    addQuestion({
        id: crypto.randomUUID(),
        title: questionTitle,
        class: selectedClassId,
        subject: selectedSubject,
        type: selectedType,
        marks: questionMarks,
        difficulty: questionDifficulty
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg flex flex-col overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">Create New Question</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-100 h-2">
            <div
                className="bg-blue-600 h-2 transition-all duration-300"
                style={{ width: `${(step / 4) * 100}%` }}
            />
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
            {step === 1 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700">Select Class</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {classes.map(cls => (
                            <button
                                key={cls.id}
                                onClick={() => setSelectedClassId(cls.id)}
                                className={`p-3 rounded border text-left transition-all ${
                                    selectedClassId === cls.id
                                    ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold ring-2 ring-blue-200'
                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                {cls.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700">Select Subject</h3>
                    {availableSubjects.length > 0 ? (
                        <div className="grid grid-cols-2 gap-3">
                            {availableSubjects.map(sub => (
                                <button
                                    key={sub}
                                    onClick={() => setSelectedSubject(sub)}
                                    className={`p-3 rounded border text-left transition-all ${
                                        selectedSubject === sub
                                        ? 'border-green-500 bg-green-50 text-green-700 font-semibold ring-2 ring-green-200'
                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    {sub}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <p className="text-red-500">No subjects found for this class. Please add subjects in Settings.</p>
                    )}
                </div>
            )}

            {step === 3 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700">Select Question Type</h3>
                    <div className="grid grid-cols-1 gap-2">
                        {questionTypes.map(type => (
                            <button
                                key={type}
                                onClick={() => setSelectedType(type)}
                                className={`p-3 rounded border text-left transition-all ${
                                    selectedType === type
                                    ? 'border-purple-500 bg-purple-50 text-purple-700 font-semibold ring-2 ring-purple-200'
                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {step === 4 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700">Question Details</h3>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-600">Question Text</label>
                        <textarea
                            value={questionTitle}
                            onChange={(e) => setQuestionTitle(e.target.value)}
                            className="w-full border border-gray-300 rounded p-3 focus:ring-2 focus:ring-blue-500 outline-none h-32"
                            placeholder="Type your question here..."
                            autoFocus
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-600">Marks</label>
                            <input
                                type="number"
                                min="1"
                                value={questionMarks}
                                onChange={(e) => setQuestionMarks(Math.max(1, parseInt(e.target.value) || 0))}
                                className="w-full border border-gray-300 rounded p-2"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-600">Difficulty</label>
                             <select
                                value={questionDifficulty}
                                onChange={(e) => setQuestionDifficulty(e.target.value as any)}
                                className="w-full border border-gray-300 rounded p-2 bg-white"
                             >
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                             </select>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-3 rounded text-sm text-gray-600">
                        <p><strong>Class:</strong> {classes.find(c => c.id === selectedClassId)?.name}</p>
                        <p><strong>Subject:</strong> {selectedSubject}</p>
                        <p><strong>Type:</strong> {selectedType}</p>
                    </div>
                </div>
            )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-between">
            {step > 1 ? (
                <button
                    onClick={handleBack}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-200 rounded"
                >
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>
            ) : (
                <div /> // Spacer
            )}

            {step < 4 ? (
                <button
                    onClick={handleNext}
                    disabled={
                        (step === 1 && !selectedClassId) ||
                        (step === 2 && !selectedSubject) ||
                        (step === 3 && !selectedType)
                    }
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next <ArrowRight className="w-4 h-4" />
                </button>
            ) : (
                <button
                    onClick={handleSave}
                    disabled={!questionTitle}
                    className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Save className="w-4 h-4" /> Save Question
                </button>
            )}
        </div>
      </div>
    </div>
  );
};
