import React, { useRef, useState, useEffect } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { draftQuestions } from '@/data/mockData';
import { toBengali, formatSerial, SerialFormat } from '@/utils/helpers';
import clsx from 'clsx';
import { Trash2, X, Check, Settings2, Eye, Download, Save, Sparkles, Settings, FileText, Brain } from 'lucide-react';
import { PreviewModal } from './PreviewModal';
import { BlockRenderer } from './blocks/BlockRenderer';

// Helper inlined due to import issues
const getBoardLabels = (board: string) => {
    if (board === 'CBSE') {
        return {
            totalMarks: 'Total Marks',
            time: 'Time',
            section: 'Section',
            question: 'Question',
            answerAny: 'Answer any',
            outOf: 'out of',
            questions: 'questions'
        };
    }
    return {
        totalMarks: 'পূর্ণমান',
        time: 'সময়',
        section: 'বিভাগ',
        question: 'প্রশ্ন',
        answerAny: 'যে কোনো',
        outOf: 'টি প্রশ্নের উত্তর দাও (মোট',
        questions: 'টি)'
    };
};

interface ExamPaperProps {
  onOpenGroupSettings?: (type: string, e: React.MouseEvent) => void;
}

export const ExamPaper = ({ onOpenGroupSettings }: ExamPaperProps) => {
  const {
    selectedQuestions,
    addQuestionToPaper,
    removeQuestion,
    updateQuestion,
    reorderQuestions,
    questionGroups,
    saveDraft,
    questionBank,
    examMeta,
    setExamMeta,
    classes,
    examTypes,
    questionTypes,
    setIsEvaluationOpen
  } = useDashboard();
  const paperRef = useRef<HTMLDivElement>(null);
  const answerKeyRef = useRef<HTMLDivElement>(null);

  const { schoolName, examName, examType, class: selectedClassId, subject, time, board } = examMeta;
  const labels = getBoardLabels(board);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [numberingFormat, setNumberingFormat] = useState<SerialFormat>('bengali');
  const [showPreview, setShowPreview] = useState(false);

  const [editTitle, setEditTitle] = useState('');
  const [editMarks, setEditMarks] = useState(0);

  const totalMarks = selectedQuestions.reduce((sum, q) => sum + q.marks, 0);

  const handleMetaChange = (key: keyof typeof examMeta, value: string) => {
      setExamMeta(prev => ({ ...prev, [key]: value }));
  };

  const currentClassSubjects = classes.find(c => c.id === selectedClassId)?.subjects || [];

  useEffect(() => {
    if (currentClassSubjects.length > 0 && !currentClassSubjects.includes(subject)) {
        handleMetaChange('subject', currentClassSubjects[0]);
    }
  }, [selectedClassId, currentClassSubjects, subject]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetIndex?: number) => {
    e.preventDefault();
    e.stopPropagation();

    const questionId = e.dataTransfer.getData('questionId');
    const source = e.dataTransfer.getData('source');
    const sourceIndex = parseInt(e.dataTransfer.getData('index') || '-1', 10);

    if (source === 'draft') {
        const questionToAdd = questionBank.find(q => q.id === questionId) || draftQuestions.find(q => q.id === questionId);
        if (questionToAdd) {
            const isAlreadyAdded = selectedQuestions.some(q => q.id === questionId);
            if (!isAlreadyAdded) {
                addQuestionToPaper(questionToAdd);
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
        if (!element) return;
        const opt = {
            margin: [10, 10, 10, 10],
            filename: `${schoolName.replace(/\s+/g, '_')}_Exam.pdf`,
            image: { type: 'jpeg' as const, quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };
        html2pdf().set(opt).from(element).save();
    }
  };

  const handleDownloadAnswerKey = async () => {
      if (typeof window !== 'undefined') {
          const html2pdf = (await import('html2pdf.js')).default;
          const element = answerKeyRef.current;
          if (!element) return;

          const opt = {
              margin: 10,
              filename: `${schoolName.replace(/\s+/g, '_')}_AnswerKey.pdf`,
              image: { type: 'jpeg' as const, quality: 0.98 },
              html2canvas: { scale: 2 },
              jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
          };
          html2pdf().set(opt).from(element).save();
      }
  };

  const handleAutoGenerate = () => {
    if (questionBank.length === 0 && draftQuestions.length === 0) return;
    const sourceData = questionBank.length > 0 ? questionBank : draftQuestions;
    const shuffled = [...sourceData].sort(() => 0.5 - Math.random());
    let addedCount = 0;
    for (const q of shuffled) {
        if (addedCount >= 5) break;
        if (!selectedQuestions.some(sq => sq.id === q.id)) {
            addQuestionToPaper(q);
            addedCount++;
        }
    }
  };

  return (
    <div className="h-full flex justify-center overflow-y-auto p-4 md:p-8 bg-gray-200 relative">
      <div
        ref={paperRef}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e)}
        className={clsx(
          "bg-white shadow-lg transition-all duration-300",
          "w-full max-w-[210mm] min-h-[297mm]",
          "p-8 md:p-12",
          "flex flex-col relative"
        )}
      >
        <div className="border border-dashed border-gray-200 h-full rounded flex-1 flex flex-col">
            <div className="text-center mb-6 border-b border-gray-200 pb-4 relative group/header">
                <div className="absolute top-0 right-0 opacity-0 group-hover/header:opacity-100 transition-opacity z-20">
                    <div className="relative group/settings bg-white p-1 rounded shadow border border-gray-200 flex gap-2">
                        <select
                            value={board}
                            onChange={(e) => handleMetaChange('board', e.target.value)}
                            className="text-xs border rounded p-1"
                        >
                            <option value="WB">WB Board</option>
                            <option value="CBSE">CBSE</option>
                        </select>

                        <select
                            value={numberingFormat}
                            onChange={(e) => setNumberingFormat(e.target.value as SerialFormat)}
                            className="text-xs border rounded p-1"
                        >
                            <option value="bengali">Bengali (১, ২)</option>
                            <option value="english">English (1, 2)</option>
                            <option value="roman">Roman (i, ii)</option>
                            <option value="alpha">Alpha (a, b)</option>
                            <option value="bengali_alpha">Bengali Alpha (ক, খ)</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-center items-center gap-2 mb-2 relative">
                    <input
                        type="text"
                        value={schoolName}
                        onChange={(e) => handleMetaChange('schoolName', e.target.value)}
                        className="text-2xl font-bold text-center w-full border-none focus:ring-0 placeholder-gray-300 text-gray-900"
                        placeholder="School Name"
                    />
                     <div className="absolute right-0 top-1/2 -translate-y-1/2 flex gap-1 print:hidden" data-html2canvas-ignore>
                        <button
                            onClick={handleAutoGenerate}
                            className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-full"
                            title="Auto-Generate"
                        >
                            <Sparkles className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleDownloadAnswerKey}
                            className="p-2 text-orange-600 hover:bg-orange-50 rounded-full"
                            title="Download Answer Key"
                        >
                            <FileText className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setIsEvaluationOpen(true)}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full"
                            title="Evaluate Answer with AI"
                        >
                            <Brain className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => saveDraft({ schoolName, examName, time, totalMarks })}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                            title="Save Draft"
                        >
                            <Save className="w-5 h-5" />
                        </button>
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

                <div className="grid grid-cols-3 gap-4 mb-4 text-sm font-semibold text-gray-700 px-4">
                     <div className="flex flex-col">
                        <select
                            value={examType}
                            onChange={(e) => handleMetaChange('examType', e.target.value)}
                            className="border-none focus:ring-0 p-0 font-bold text-gray-800 text-center bg-transparent cursor-pointer hover:bg-gray-50 rounded"
                        >
                            {examTypes?.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <input
                            type="text"
                            value={examName}
                            onChange={(e) => handleMetaChange('examName', e.target.value)}
                            className="text-xs text-center border-none focus:ring-0 p-0 text-gray-500 placeholder-gray-300"
                            placeholder="Year/Session"
                        />
                     </div>

                     <div className="flex flex-col items-center">
                        <select
                            value={selectedClassId}
                            onChange={(e) => handleMetaChange('class', e.target.value)}
                            className="border-none focus:ring-0 p-0 font-bold text-gray-800 text-center bg-transparent cursor-pointer hover:bg-gray-50 rounded"
                        >
                             {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        <select
                            value={subject}
                            onChange={(e) => handleMetaChange('subject', e.target.value)}
                            className="text-xs text-center border-none focus:ring-0 p-0 text-gray-600 bg-transparent cursor-pointer hover:bg-gray-50 rounded"
                        >
                            {currentClassSubjects.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                     </div>

                     <div className="text-right">
                         <div className="flex justify-end items-center gap-1">
                             <span className="text-gray-500">{labels.time}:</span>
                             <input
                                type="text"
                                value={time}
                                onChange={(e) => handleMetaChange('time', e.target.value)}
                                className="border-none focus:ring-0 p-0 font-bold text-gray-800 w-24 text-right"
                            />
                         </div>
                         <div className="text-gray-500 text-xs mt-1">
                            {labels.totalMarks}: <span className="font-bold text-gray-800">{toBengali(totalMarks)}</span>
                         </div>
                     </div>
                </div>
            </div>

            {selectedQuestions.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-4">
                    <div className="bg-blue-50 p-4 rounded-full mb-2">
                        <Sparkles className="w-12 h-12 text-blue-500" />
                    </div>
                    <p className="text-lg font-medium text-gray-600">Your Exam Paper is Empty</p>
                    <p className="text-sm text-center max-w-xs">Drag questions from the left, or let AI start for you by picking random questions.</p>
                    <button
                        onClick={handleAutoGenerate}
                        className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-full font-bold shadow-lg hover:bg-blue-700 transition-colors flex items-center gap-2 active:scale-95 touch-manipulation"
                    >
                        <Sparkles className="w-5 h-5" />
                        Auto-Generate Paper
                    </button>
                </div>
            ) : (
                <div className="space-y-6 p-4">
                   {questionTypes.map((type, typeIndex) => {
                       const questionsOfType = selectedQuestions.filter(q => q.type === type);
                       if (questionsOfType.length === 0) return null;

                       const groupConfig = questionGroups.find(g => g.type === type);

                       return (
                           <div key={type} className="break-inside-avoid">
                                <div className="mb-2 font-bold text-gray-800 text-lg border-b-2 border-gray-100 pb-1 flex justify-between items-end">
                                    <div className="flex items-center gap-2">
                                        <span>{type} {labels.questions}</span>
                                        <button
                                            onClick={(e) => onOpenGroupSettings && onOpenGroupSettings(type, e)}
                                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors rounded-full hover:bg-blue-50 touch-manipulation print:hidden"
                                            title="Group Settings"
                                            data-html2canvas-ignore
                                        >
                                            <Settings className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {groupConfig && (
                                        <span className="text-sm font-normal text-gray-500">
                                            {labels.answerAny} {numberingFormat === 'bengali' ? toBengali(groupConfig.totalToAnswer) : groupConfig.totalToAnswer} {labels.outOf}
                                        </span>
                                    )}
                                </div>
                                <div className="space-y-3">
                                    {questionsOfType.map((q, index) => {
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
                                            className="p-3 border border-gray-100 rounded hover:bg-gray-50 group relative transition-all touch-none break-inside-avoid"
                                        >
                                            <button
                                                onClick={(e) => { e.stopPropagation(); removeQuestion(q.id); }}
                                                className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-opacity z-10 print:hidden"
                                                title="Remove Question"
                                                data-html2canvas-ignore
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
                                                        <div className="w-full">
                                                            {q.blocks && q.blocks.length > 0 ? (
                                                                <div className="space-y-1">
                                                                    {q.blocks.map(b => (
                                                                        <BlockRenderer key={b.id} block={b} />
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <p className="text-gray-900 font-medium">{q.title}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <span className="text-sm font-semibold text-gray-600 ml-2 whitespace-nowrap">{toBengali(q.marks)}</span>
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

            <div className="mt-auto pt-8 text-center text-sm text-gray-400 font-medium border-t border-gray-100">
                <p>Generated by ExamBuilder</p>
                <p className="text-xs mt-1">Best of Luck</p>
            </div>
        </div>
      </div>

      <div
        ref={answerKeyRef}
        className="absolute top-0 left-[-9999px] bg-white p-12 w-[210mm] min-h-[297mm]"
      >
          <div className="text-center mb-8 border-b-2 border-black pb-4">
              <h1 className="text-2xl font-bold mb-2">Answer Key</h1>
              <h2 className="text-xl">{schoolName}</h2>
              <div className="text-sm mt-2">{examType} Exam - {examMeta.examName}</div>
              <div className="text-sm">Class: {classes.find(c => c.id === selectedClassId)?.name} | Sub: {subject}</div>
          </div>

          <div className="space-y-4">
              {selectedQuestions.map((q, idx) => (
                  <div key={q.id} className="flex gap-4 border-b border-gray-100 pb-2">
                      <span className="font-bold min-w-[30px]">{formatSerial(idx, numberingFormat)}.</span>
                      <div>
                          <div className="font-medium text-gray-900 text-sm mb-1">Q: {q.title}</div>
                          <div className="text-green-700 font-semibold bg-green-50 p-2 rounded text-sm">
                              Ans: {q.answer || "No model answer provided."}
                          </div>
                      </div>
                  </div>
              ))}
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
