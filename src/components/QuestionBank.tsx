import React from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { draftQuestions } from '@/data/mockData';
import { QuestionCard } from './QuestionCard';

export const QuestionBank = () => {
  const { selectedClass, selectedSubject, setSelectedClass, setSelectedSubject } = useDashboard();

  // Filter questions based on selected class and subject
  // Note: If subject is 'All', we show all subjects.
  // Initially we just strictly filter.
  const filteredQuestions = draftQuestions.filter((q) => {
    const classMatch = q.class === selectedClass;
    const subjectMatch = selectedSubject === 'All' || q.subject === selectedSubject;
    return classMatch && subjectMatch;
  });

  // Extract unique classes and subjects for filter dropdowns
  const classes = Array.from(new Set(draftQuestions.map(q => q.class))).sort();
  // We might want predefined subjects, but extracting from data is fine for now
  const subjects = ['All', ...Array.from(new Set(draftQuestions.map(q => q.subject))).sort()];

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-gray-50">
        <h2 className="text-lg font-bold text-gray-800 mb-3">Question Bank</h2>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full text-sm p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-700"
            >
              {classes.map(cls => (
                <option key={cls} value={cls}>{cls.replace('-', ' ').toUpperCase()}</option>
              ))}
            </select>
          </div>

          <div>
             <label className="block text-xs font-semibold text-gray-500 mb-1">Subject</label>
             <select
               value={selectedSubject}
               onChange={(e) => setSelectedSubject(e.target.value)}
               className="w-full text-sm p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-700"
             >
                {subjects.map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                ))}
             </select>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 bg-gray-50/50">
        {filteredQuestions.length > 0 ? (
            filteredQuestions.map(q => (
                <QuestionCard key={q.id} question={q} />
            ))
        ) : (
            <div className="text-center py-8 text-gray-400 text-sm">
                No questions found for this selection.
            </div>
        )}
      </div>
    </div>
  );
};
