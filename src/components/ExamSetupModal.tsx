import React, { useState, useEffect } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { X, Plus, Trash2, Edit2, Check, Settings, Sparkles } from 'lucide-react';
import { BoardType } from '@/types';
import axios from 'axios';
import clsx from 'clsx';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const ExamSetupModal = ({ onClose }: { onClose: () => void }) => {
  const {
    examMeta, setExamMeta,
    examTypes, addExamType, updateExamType, removeExamType,
    selectedClass, setSelectedClass,
    selectedSubject, setSelectedSubject
  } = useDashboard();

  const [isManagingTypes, setIsManagingTypes] = useState(false);
  const [newTypeName, setNewTypeName] = useState('');
  const [editingType, setEditingType] = useState<{ original: string, current: string } | null>(null);
  const [suggestion, setSuggestion] = useState<{class?: string, subject?: string} | null>(null);

  useEffect(() => {
      const fetchSuggestions = async () => {
          try {
              const res = await axios.get(`${API_URL}/api/user-suggestions`);
              if (res.data.class || res.data.subject) {
                  setSuggestion(res.data);
                  if (res.data.class) setSelectedClass(res.data.class);
                  if (res.data.subject) setSelectedSubject(res.data.subject);
              }
          } catch (e) {
              console.error(e);
          }
      };
      fetchSuggestions();
  }, []);

  const handleSave = () => {
    onClose();
  };

  const handleAddType = () => {
      if (newTypeName.trim()) {
          addExamType(newTypeName.trim());
          setNewTypeName('');
      }
  };

  const handleUpdateType = () => {
      if (editingType && editingType.current.trim()) {
          updateExamType(editingType.original, editingType.current.trim());
          setEditingType(null);
      }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">প্রশ্নপত্র সেটআপ (Exam Setup)</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5 text-gray-500" />
            </button>
        </div>

        <div className="p-6 space-y-6">

            {/* Class & Subject */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">শ্রেणी (Class)</label>
                    <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    >
                        {['class-6', 'class-7', 'class-8', 'class-9', 'class-10'].map(c => (
                            <option key={c} value={c}>{c.replace('-', ' ').toUpperCase()}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">বিষয় (Subject)</label>
                    <select
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    >
                        {['Math', 'Science', 'Bengali', 'English', 'History'].map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Exam Type Management */}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-semibold text-gray-700">পরীক্ষার ধরন (Exam Type)</label>
                    <button
                        onClick={() => setIsManagingTypes(!isManagingTypes)}
                        className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                        <Settings className="w-3 h-3" />
                        {isManagingTypes ? 'Done' : 'Manage Types'}
                    </button>
                </div>

                {isManagingTypes ? (
                    <div className="bg-gray-50 p-4 rounded border border-gray-200 mb-4 space-y-2">
                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                value={newTypeName}
                                onChange={(e) => setNewTypeName(e.target.value)}
                                placeholder="New Exam Type"
                                className="flex-1 p-2 text-sm border rounded"
                            />
                            <button onClick={handleAddType} className="bg-green-600 text-white p-2 rounded hover:bg-green-700">
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                        <ul className="space-y-2 max-h-40 overflow-y-auto">
                            {examTypes.map(type => (
                                <li key={type} className="flex justify-between items-center bg-white p-2 rounded shadow-sm">
                                    {editingType?.original === type ? (
                                        <input
                                            value={editingType.current}
                                            onChange={(e) => setEditingType({ ...editingType, current: e.target.value })}
                                            className="border rounded p-1 text-sm flex-1 mr-2"
                                        />
                                    ) : (
                                        <span className="text-sm">{type}</span>
                                    )}

                                    <div className="flex gap-1">
                                        {editingType?.original === type ? (
                                            <button onClick={handleUpdateType} className="text-green-600"><Check className="w-4 h-4" /></button>
                                        ) : (
                                            <button onClick={() => setEditingType({ original: type, current: type })} className="text-blue-600"><Edit2 className="w-4 h-4" /></button>
                                        )}
                                        <button onClick={() => removeExamType(type)} className="text-red-500"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <select
                        value={examMeta.examType}
                        onChange={(e) => setExamMeta(prev => ({ ...prev, examType: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    >
                        {examTypes.map(t => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                )}
            </div>

            {/* Exam Name & Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">পরীক্ষার নাম (Title)</label>
                    <input
                        type="text"
                        value={examMeta.examName}
                        onChange={(e) => setExamMeta(prev => ({ ...prev, examName: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. Half Yearly Exam 2024"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">সময় (Time)</label>
                    <input
                        type="text"
                        value={examMeta.time}
                        onChange={(e) => setExamMeta(prev => ({ ...prev, time: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

             {/* Board & Total Marks */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Board Format</label>
                    <select
                        value={examMeta.board || 'WB'}
                        onChange={(e) => setExamMeta(prev => ({ ...prev, board: e.target.value as BoardType }))}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="WB">West Bengal (Bengali)</option>
                        <option value="CBSE">CBSE (English)</option>
                        <option value="Custom">Custom</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">মোট নম্বর (Total Marks)</label>
                    <input
                        type="number"
                        value={examMeta.declaredTotalMarks}
                        onChange={(e) => setExamMeta(prev => ({ ...prev, declaredTotalMarks: parseInt(e.target.value) || 0 }))}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

        </div>

        <div className="p-6 border-t border-gray-100 flex justify-end">
            <button
                onClick={handleSave}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
            >
                Save & Continue
            </button>
        </div>

        {/* Smart Suggestion Toast */}
        {suggestion && (
            <div className="absolute bottom-4 left-4 right-4 bg-gray-900 text-white p-4 rounded shadow-lg flex items-center justify-between z-10 animate-pulse">
                <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                    <div>
                        <p className="text-sm font-bold">Smart Suggestion applied</p>
                        <p className="text-xs text-gray-300">
                            Based on your history: {suggestion.class?.replace('-',' ').toUpperCase()} | {suggestion.subject}
                        </p>
                    </div>
                </div>
                <button onClick={() => setSuggestion(null)} className="text-gray-400 hover:text-white">
                    <X className="w-4 h-4" />
                </button>
            </div>
        )}
      </div>
    </div>
  );
};
