import React, { useState, useEffect } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { QuestionCard } from './QuestionCard';
import { Loader2, Plus, Filter } from 'lucide-react';
import { QuestionCreator } from './QuestionCreator';

export const QuestionBank = () => {
  const {
    selectedClass,
    selectedSubject,
    setSelectedClass,
    setSelectedSubject,
    questionBank,
    isLoadingQuestions,
    classes: contextClasses, // Use the structured classes from context
    questionTypes
  } = useDashboard();

  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('All');

  // Filter questions based on selected class, subject, and type
  const filteredQuestions = questionBank.filter((q) => {
    const classMatch = q.class === selectedClass;
    const subjectMatch = selectedSubject === 'All' || q.subject === selectedSubject;
    const typeMatch = selectedTypeFilter === 'All' || q.type === selectedTypeFilter;
    return classMatch && subjectMatch && typeMatch;
  });

  // Get subjects for the selected class from the context structure
  const currentClassData = contextClasses.find(c => c.id === selectedClass);
  const availableSubjects = currentClassData ? ['All', ...currentClassData.subjects] : ['All'];

  // Initialize selectedClass if needed
  useEffect(() => {
      if (contextClasses.length > 0 && !contextClasses.find(c => c.id === selectedClass)) {
          setSelectedClass(contextClasses[0].id);
      }
  }, [contextClasses, selectedClass, setSelectedClass]);

  // Initialize selectedSubject if needed
  useEffect(() => {
     if (currentClassData && !currentClassData.subjects.includes(selectedSubject) && selectedSubject !== 'All') {
         setSelectedSubject('All');
     }
  }, [currentClassData, selectedSubject, setSelectedSubject]);


  if (isLoadingQuestions) {
      return (
          <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-gray-200 justify-center items-center">
             <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
             <p className="mt-2 text-sm text-gray-500">Loading Question Bank...</p>
          </div>
      );
  }

  return (
    <>
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-gray-50">
        <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold text-gray-800">Question Bank</h2>
            <button
                onClick={() => setIsCreatorOpen(true)}
                className="bg-blue-600 text-white p-1.5 rounded-full hover:bg-blue-700 shadow-sm"
                title="Add New Question"
            >
                <Plus className="w-5 h-5" />
            </button>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Class</label>
                <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full text-sm p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-700"
                >
                {contextClasses.map(cls => (
                    <option key={cls.id} value={cls.id}>{cls.name}</option>
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
                    {availableSubjects.map(sub => (
                        <option key={sub} value={sub}>{sub}</option>
                    ))}
                </select>
            </div>
          </div>

          <div>
             <label className="block text-xs font-semibold text-gray-500 mb-1">Question Type</label>
             <select
               value={selectedTypeFilter}
               onChange={(e) => setSelectedTypeFilter(e.target.value)}
               className="w-full text-sm p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-700"
             >
                <option value="All">All Types</option>
                {questionTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
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
            <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-2">
                <Filter className="w-8 h-8 opacity-20" />
                <p className="text-sm">No questions found.</p>
                <button onClick={() => setIsCreatorOpen(true)} className="text-xs text-blue-600 hover:underline">
                    Create a new question
                </button>
            </div>
        )}
      </div>
    </div>

    {isCreatorOpen && (
        <QuestionCreator onClose={() => setIsCreatorOpen(false)} />
    )}
    </>
  );
};
