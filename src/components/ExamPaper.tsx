import React, { useRef, useState } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { draftQuestions } from '@/data/mockData';
import { toBengali, formatSerial } from '@/utils/helpers';
import clsx from 'clsx';
import { Trash2, X, Check, Settings2, Eye, Download } from 'lucide-react';
import { PreviewModal } from './PreviewModal';

export const ExamPaper = () => {
  const { selectedQuestions, addQuestion, removeQuestion, updateQuestion, reorderQuestions, questionGroups } = useDashboard();
  const paperRef = useRef<HTMLDivElement>(null);

  const [schoolName, setSchoolName] = useState('Govt. High School');
  const [examName, setExamName] = useState('Half Yearly Exam 2024');
  const [time, setTime] = useState('2 Hours 30 Minutes');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [numberingFormat, setNumberingFormat] = useState<'english' | 'bengali' | 'roman'>('bengali');
  const [showPreview, setShowPreview] = useState(false);

  // Local state for editing fields
  const [editTitle, setEditTitle] = useState('');
  const [editMarks, setEditMarks] = useState(0);

  const totalMarks = selectedQuestions.reduce((sum, q) => sum + q.marks, 0);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetIndex?: number) => {
    e.preventDefault();
    e.stopPropagation(); // Stop propagation to avoid double drop handling

    const questionId = e.dataTransfer.getData('questionId');
    const source = e.dataTransfer.getData('source');
    const sourceIndex = parseInt(e.dataTransfer.getData('index') || '-1', 10);

    if (source === 'draft') {
        const questionToAdd = draftQuestions.find(q => q.id === questionId);
        if (questionToAdd) {
            const isAlreadyAdded = selectedQuestions.some(q => q.id === questionId);
            if (!isAlreadyAdded) {
                addQuestion(questionToAdd);
            }
        }
    } else if (source === 'paper' && sourceIndex !== -1 && targetIndex !== undefined) {
         reorderQuestions(sourceIndex, targetIndex);
    }
  };

  const startEditing = (q: { id: string; title: string; marks: number }) => {
    setEditingId(q.id);
    setEditTitle(q.title);
    setEditMarks(q.marks);
  };

  const saveEdit = (id: string) => {
    updateQuestion(id, { title: editTitle, marks: editMarks });
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleDownloadPDF = async () => {
    if (typeof window !== 'undefined') {
        const html2pdf = (await import('html2pdf.js')).default;
        const element = paperRef.current;
        const opt = {
            margin: 10, // mm
            filename: `${schoolName.replace(/\s+/g, '_')}_Exam.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(element).save();
    }
  };

  return (
    <div className="h-full flex justify-center overflow-y-auto p-4 md:p-8 bg-gray-200">
      <div
        ref={paperRef}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e)}
        className={clsx(
          "bg-white shadow-lg transition-all duration-300",
          "w-full max-w-[210mm] min-h-[297mm]", // A4 Dimensions roughly
          "p-8 md:p-12",
          "flex flex-col relative"
        )}
      >
        <div className="border border-dashed border-gray-200 h-full rounded flex-1 flex flex-col">
             {/* Header Section */}
            <div className="text-center mb-6 border-b border-gray-200 pb-4 relative group/header">
                {/* Format Settings Trigger (visible on hover) */}
                <div className="absolute top-0 right-0 opacity-0 group-hover/header:opacity-100 transition-opacity">
                    <div className="relative group/settings">
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                            <Settings2 className="w-5 h-5" />
                        </button>
                        <div className="absolute right-0 top-full bg-white shadow-md border border-gray-200 rounded p-2 hidden group-hover/settings:block w-32 z-20">
                            <p className="text-xs font-semibold text-gray-500 mb-2">Numbering</p>
                            <select
                                value={numberingFormat}
                                onChange={(e) => setNumberingFormat(e.target.value as 'english' | 'bengali' | 'roman')}
                                className="w-full text-xs border rounded p-1"
                            >
                                <option value="bengali">Bengali</option>
                                <option value="english">English</option>
                                <option value="roman">Roman</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center items-center gap-2 mb-2 relative">
                    <input
                        type="text"
                        value={schoolName}
                        onChange={(e) => setSchoolName(e.target.value)}
                        className="text-2xl font-bold text-center w-full border-none focus:ring-0 placeholder-gray-300 text-gray-900"
                        placeholder="School Name"
                    />
                     <div className="absolute right-0 top-1/2 -translate-y-1/2 flex gap-1">
                        <button
                            onClick={handleDownloadPDF}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-full"
                            title="Download PDF"
                        >
                            <Download className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setShowPreview(true)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                            title="Validate & Preview"
                        >
                            <Eye className="w-5 h-5" />
                        </button>
                     </div>
                </div>
                <div className="flex justify-between items-center px-4 text-sm font-semibold text-gray-700">
                    <div className="flex gap-2 items-center">
                        <span>Exam:</span>
                        <input
                            type="text"
                            value={examName}
                            onChange={(e) => setExamName(e.target.value)}
                            className="border-none focus:ring-0 p-0 text-sm font-semibold text-gray-700 w-40"
                        />
                    </div>
                    <div>
                         <span>Time: </span>
                         <input
                            type="text"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="border-none focus:ring-0 p-0 text-sm font-semibold text-gray-700 w-32 text-right"
                        />
                    </div>
                    <div>
                        <span>Total Marks: {toBengali(totalMarks)}</span>
                    </div>
                </div>
            </div>

            {selectedQuestions.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-gray-400">
                    <p>Drag questions here from the Question Bank</p>
                </div>
            ) : (
                <div className="space-y-6 p-4">
                   {/* Group by Type */}
                   {['MCQ', 'Short Answer', 'Creative'].map((type) => {
                       const questionsOfType = selectedQuestions.filter(q => q.type === type);
                       if (questionsOfType.length === 0) return null;

                       const groupConfig = questionGroups.find(g => g.type === type);

                       return (
                           <div key={type}>
                                <div className="mb-2 font-bold text-gray-800 text-lg border-b-2 border-gray-100 pb-1 flex justify-between items-end">
                                    <span>{type} Questions</span>
                                    {groupConfig && (
                                        <span className="text-sm font-normal text-gray-500">
                                            Answer any {numberingFormat === 'bengali' ? toBengali(groupConfig.totalToAnswer) : groupConfig.totalToAnswer} questions
                                        </span>
                                    )}
                                </div>
                                <div className="space-y-3">
                                    {questionsOfType.map((q, index) => {
                                        // Find global index for reordering
                                        const globalIndex = selectedQuestions.findIndex(sq => sq.id === q.id);

                                        return (
                                        <div
                                            key={q.id}
                                            draggable
                                            onDragStart={(e) => {
                                                e.dataTransfer.setData('questionId', q.id);
                                                e.dataTransfer.setData('source', 'paper');
                                                e.dataTransfer.setData('index', globalIndex.toString());
                                            }}
                                            onDrop={(e) => handleDrop(e, globalIndex)}
                                            onDragOver={handleDragOver}
                                            className="p-3 border border-gray-100 rounded hover:bg-gray-50 group relative transition-all touch-none"
                                        >
                                            {/* Remove Button */}
                                            <button
                                                onClick={(e) => { e.stopPropagation(); removeQuestion(q.id); }}
                                                className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-opacity z-10"
                                                title="Remove Question"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>

                                            {editingId === q.id ? (
                                                <div className="flex flex-col gap-2 w-full pr-8">
                                                    <input
                                                        type="text"
                                                        value={editTitle}
                                                        onChange={(e) => setEditTitle(e.target.value)}
                                                        className="border border-gray-300 rounded p-1 text-sm w-full"
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs text-gray-500">Marks:</span>
                                                            <input
                                                                type="number"
                                                                value={editMarks}
                                                                onChange={(e) => setEditMarks(Number(e.target.value))}
                                                                className="border border-gray-300 rounded p-1 text-sm w-16"
                                                                onClick={(e) => e.stopPropagation()}
                                                            />
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button onClick={() => saveEdit(q.id)} className="text-green-600 hover:text-green-700">
                                                                <Check className="w-4 h-4" />
                                                            </button>
                                                            <button onClick={cancelEdit} className="text-gray-400 hover:text-gray-600">
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div
                                                    onClick={() => startEditing(q)}
                                                    className="flex justify-between items-start cursor-pointer w-full pr-6"
                                                    title="Click to edit"
                                                >
                                                    <div className="flex gap-3">
                                                        <span className="font-bold text-gray-500 min-w-[20px]">
                                                            {formatSerial(index, numberingFormat)}.
                                                        </span>
                                                        <div>
                                                            <p className="text-gray-900 font-medium">{q.title}</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-sm font-semibold text-gray-600">{toBengali(q.marks)}</span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                    })}
                                </div>
                           </div>
                       );
                   })}
                </div>
            )}
        </div>
      </div>

      {showPreview && (
          <PreviewModal
            onClose={() => setShowPreview(false)}
            schoolName={schoolName}
          />
      )}
    </div>
  );
};
