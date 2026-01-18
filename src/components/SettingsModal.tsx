import React, { useState } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { X, Plus, Trash2, Edit2, Check, ChevronDown, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { ClassStructure } from '@/types';

export const SettingsModal = () => {
  const {
    isSettingsOpen, setIsSettingsOpen,
    classes, addClass, updateClass, deleteClass,
    addSubject, deleteSubject,
    questionTypes, addQuestionType, deleteQuestionType
  } = useDashboard();

  const [activeTab, setActiveTab] = useState<'classes' | 'types'>('classes');

  // Local state for forms
  const [newClassName, setNewClassName] = useState('');
  const [newClassId, setNewClassId] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newType, setNewType] = useState('');
  const [expandedClass, setExpandedClass] = useState<string | null>(null);

  if (!isSettingsOpen) return null;

  const handleAddClass = () => {
    if (newClassName && newClassId) {
      addClass({ id: newClassId, name: newClassName, subjects: [] });
      setNewClassName('');
      setNewClassId('');
    }
  };

  const handleAddSubject = (classId: string) => {
    if (newSubject) {
        addSubject(classId, newSubject);
        setNewSubject('');
    }
  };

  const handleAddType = () => {
    if (newType) {
        addQuestionType(newType);
        setNewType('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl h-[80vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">Settings</h2>
          <button onClick={() => setIsSettingsOpen(false)} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('classes')}
            className={clsx(
              "flex-1 py-3 text-sm font-semibold transition-colors",
              activeTab === 'classes' ? "border-b-2 border-blue-600 text-blue-600 bg-blue-50" : "text-gray-600 hover:bg-gray-50"
            )}
          >
            Classes & Subjects
          </button>
          <button
            onClick={() => setActiveTab('types')}
            className={clsx(
              "flex-1 py-3 text-sm font-semibold transition-colors",
              activeTab === 'types' ? "border-b-2 border-blue-600 text-blue-600 bg-blue-50" : "text-gray-600 hover:bg-gray-50"
            )}
          >
            Question Types
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {activeTab === 'classes' && (
            <div className="space-y-6">
               {/* Add New Class */}
               <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-700 mb-3">Add New Class</h3>
                  <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Class ID (e.g., class-10)"
                        value={newClassId}
                        onChange={(e) => setNewClassId(e.target.value)}
                        className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <input
                        type="text"
                        placeholder="Class Name (e.g., Class 10)"
                        value={newClassName}
                        onChange={(e) => setNewClassName(e.target.value)}
                        className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <button
                        onClick={handleAddClass}
                        className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                        disabled={!newClassName || !newClassId}
                    >
                        Add
                    </button>
                  </div>
               </div>

               {/* Class List */}
               <div className="space-y-2">
                  {classes.map((cls) => (
                      <div key={cls.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                          <div
                            className="p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                            onClick={() => setExpandedClass(expandedClass === cls.id ? null : cls.id)}
                          >
                              <div className="flex items-center gap-2">
                                  {expandedClass === cls.id ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                                  <span className="font-semibold text-gray-800">{cls.name}</span>
                                  <span className="text-xs text-gray-400 ml-2">({cls.subjects.length} subjects)</span>
                              </div>
                              <button
                                onClick={(e) => { e.stopPropagation(); deleteClass(cls.id); }}
                                className="text-red-400 hover:text-red-600 p-1"
                              >
                                  <Trash2 className="w-4 h-4" />
                              </button>
                          </div>

                          {expandedClass === cls.id && (
                              <div className="p-4 bg-gray-50 border-t border-gray-100">
                                  <div className="flex gap-2 mb-3">
                                      <input
                                          type="text"
                                          placeholder="Add Subject..."
                                          value={newSubject}
                                          onChange={(e) => setNewSubject(e.target.value)}
                                          className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm"
                                          onClick={(e) => e.stopPropagation()}
                                      />
                                      <button
                                        onClick={(e) => { e.stopPropagation(); handleAddSubject(cls.id); }}
                                        className="bg-green-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-green-700"
                                      >
                                          Add Subject
                                      </button>
                                  </div>
                                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                      {cls.subjects.map(sub => (
                                          <div key={sub} className="flex items-center justify-between bg-white px-3 py-2 rounded border border-gray-200 text-sm">
                                              <span>{sub}</span>
                                              <button onClick={() => deleteSubject(cls.id, sub)} className="text-gray-400 hover:text-red-500">
                                                  <X className="w-3 h-3" />
                                              </button>
                                          </div>
                                      ))}
                                  </div>
                              </div>
                          )}
                      </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === 'types' && (
              <div className="space-y-6">
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                      <h3 className="text-sm font-bold text-gray-700 mb-3">Add Question Type</h3>
                      <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Type Name (e.g., MCQ)"
                            value={newType}
                            onChange={(e) => setNewType(e.target.value)}
                            className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <button
                            onClick={handleAddType}
                            className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                            disabled={!newType}
                        >
                            Add
                        </button>
                      </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {questionTypes.map((type) => (
                          <div key={type} className="flex items-center justify-between bg-white p-3 rounded border border-gray-200 shadow-sm">
                              <span className="font-medium text-gray-700">{type}</span>
                              <button onClick={() => deleteQuestionType(type)} className="text-gray-400 hover:text-red-600">
                                  <Trash2 className="w-4 h-4" />
                              </button>
                          </div>
                      ))}
                  </div>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};
