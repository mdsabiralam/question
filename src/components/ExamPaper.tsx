import React, { useRef, useState } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { draftQuestions } from '@/data/mockData';
import { toBengali, formatSerial } from '@/utils/helpers';
import clsx from 'clsx';
import { Trash2, X, Check, Settings2, Eye, Download, Save, Sparkles, Settings, Plus, AlertTriangle, FileEdit, PenTool, FileKey } from 'lucide-react';
import { PreviewModal } from './PreviewModal';
import { SectionModal } from './SectionModal';
import { QuestionEditorModal } from './question-editor/QuestionEditorModal';
import { PrintablePaper } from './PrintablePaper';
import { PrintableAnswerKey } from './PrintableAnswerKey';
import { Section, Question } from '@/types';
import { SortableExamItem } from './SortableExamItem';

// Dnd Kit
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragEndEvent,
  DragOverEvent,
  useDroppable
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { QuestionCard } from './QuestionCard';

interface ExamPaperProps {
  onOpenGroupSettings?: (type: 'MCQ' | 'Short Answer' | 'Creative', e: React.MouseEvent) => void;
  onOpenSetup?: () => void;
}

// Helper for Droppable Section
const DroppableSection = ({ children, id }: { children: React.ReactNode; id: string }) => {
    const { setNodeRef, isOver } = useDroppable({ id });
    const style = {
        backgroundColor: isOver ? '#eff6ff' : undefined,
    };
    return (
        <div ref={setNodeRef} style={style} className="space-y-3 min-h-[50px] border border-transparent hover:border-blue-100 rounded transition-colors">
            {children}
        </div>
    );
};

export const ExamPaper = ({ onOpenGroupSettings, onOpenSetup }: ExamPaperProps) => {
  const {
      selectedQuestions, addQuestion, removeQuestion, updateQuestion, reorderQuestions,
      saveDraft, questionBank, examMeta, setExamMeta,
      sections, addSection, updateSection, removeSection, reorderSections
  } = useDashboard();
  const paperRef = useRef<HTMLDivElement>(null);

  // Refs for printing
  const printPaperRef = useRef<HTMLDivElement>(null);
  const printKeyRef = useRef<HTMLDivElement>(null);

  const { schoolName, examName, examType, time, declaredTotalMarks } = examMeta;

  const [editingId, setEditingId] = useState<string | null>(null);
  const [numberingFormat, setNumberingFormat] = useState<'english' | 'bengali' | 'roman'>('bengali');
  const [showPreview, setShowPreview] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Section Modal State
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);

  // Rich Editor State
  const [questionForRichEdit, setQuestionForRichEdit] = useState<Question | null>(null);

  // Local state for editing fields
  const [editTitle, setEditTitle] = useState('');
  const [editMarks, setEditMarks] = useState(0);

  // Calculate Totals
  const calculatedSectionMarks = sections.reduce((sum, s) => sum + (s.marksPerQuestion * s.questionsToAttempt), 0);
  const totalMarks = calculatedSectionMarks;

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor, {
        activationConstraint: {
            delay: 250,
            tolerance: 5,
        }
    }),
    useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleMetaChange = (key: keyof typeof examMeta, value: string) => {
      setExamMeta(prev => ({ ...prev, [key]: value }));
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

  const handleSaveRichEdit = (updatedQ: Question) => {
      updateQuestion(updatedQ.id, { blocks: updatedQ.blocks, title: updatedQ.title, answer: updatedQ.answer });
      setQuestionForRichEdit(null);
  };

  const handleExport = async (type: 'paper' | 'key') => {
    if (typeof window !== 'undefined') {
        const html2pdf = (await import('html2pdf.js')).default;
        const element = type === 'paper' ? printPaperRef.current : printKeyRef.current;
        const filename = `${schoolName.replace(/\s+/g, '_')}_${type === 'paper' ? 'Exam' : 'AnswerKey'}.pdf`;

        if (!element) {
            console.error("Print ref not found");
            return;
        }

        const opt = {
            margin: 10,
            filename: filename,
            image: { type: 'jpeg' as const, quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
        };
        html2pdf().set(opt).from(element).save();
    }
  };

  const handleAddSection = () => {
      setEditingSection(null);
      setIsSectionModalOpen(true);
  };

  const handleEditSection = (section: Section) => {
      setEditingSection(section);
      setIsSectionModalOpen(true);
  };

  const handleSaveSection = (section: Section) => {
      if (editingSection) {
          updateSection(section);
      } else {
          addSection(section);
      }
      setIsSectionModalOpen(false);
  };

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    // Handle Drop from Bank (active.id starts with bank-)
    if (active.id.toString().startsWith('bank-')) {
        const questionId = active.id.toString().replace('bank-', '');
        // Determine Section
        let sectionId: string | undefined;

        // If dropped on a section (DroppableSection has id = section.id)
        const droppedOnSection = sections.find(s => s.id === over.id);
        if (droppedOnSection) {
            sectionId = droppedOnSection.id;
        } else {
            // If dropped on a question item, find which section that question belongs to
            const droppedOnQuestion = selectedQuestions.find(q => q.id === over.id);
            if (droppedOnQuestion) {
                sectionId = droppedOnQuestion.sectionId;
            }
        }

        const questionToAdd = questionBank.find(q => q.id === questionId) || draftQuestions.find(q => q.id === questionId);
        if (questionToAdd) {
            if (sectionId) {
                const section = sections.find(s => s.id === sectionId);
                if (section && section.questionType !== questionToAdd.type) {
                    alert(`This section only accepts ${section.questionType} questions.`);
                    return;
                }
            }
            const isAlreadyAdded = selectedQuestions.some(q => q.id === questionId);
            if (!isAlreadyAdded) {
                // Determine index if dropped over another question
                // But addQuestion interface might strictly append or allow index?
                // Standard addQuestion appends.
                addQuestion(questionToAdd, sectionId);
                // If dropped over a specific index, we might need to move it there.
                // But simplified for now: add to section.
            }
        }
    }
    // Handle Sorting within Paper
    else {
        if (active.id !== over.id) {
            const oldIndex = selectedQuestions.findIndex(q => q.id === active.id);
            const newIndex = selectedQuestions.findIndex(q => q.id === over.id);
            if (oldIndex !== -1 && newIndex !== -1) {
                reorderQuestions(oldIndex, newIndex);
            }
        }
    }
  };

  return (
    <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
    >
    <div className="h-full flex justify-center overflow-y-auto p-4 md:p-8 bg-gray-200">
      <div
        ref={paperRef}
        className={clsx(
          "bg-white shadow-lg transition-all duration-300",
          "w-full max-w-[210mm] min-h-[297mm]",
          "p-8 md:p-12",
          "flex flex-col relative"
        )}
      >
        <div className="border border-dashed border-gray-200 h-full rounded flex-1 flex flex-col">
             {/* Header Section */}
            <div className="text-center mb-6 border-b border-gray-200 pb-4 relative group/header">
                {/* Format Settings Trigger */}
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
                        onChange={(e) => handleMetaChange('schoolName', e.target.value)}
                        className="text-2xl font-bold text-center w-full border-none focus:ring-0 placeholder-gray-300 text-gray-900"
                        placeholder="School Name"
                    />
                     <div className="absolute right-0 top-1/2 -translate-y-1/2 flex gap-1">
                        {onOpenSetup && (
                            <button
                                onClick={onOpenSetup}
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
                                title="Paper Setup"
                            >
                                <FileEdit className="w-5 h-5" />
                            </button>
                        )}
                        <button
                            onClick={() => saveDraft({ ...examMeta, totalMarks })}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                            title="Save Draft"
                        >
                            <Save className="w-5 h-5" />
                        </button>

                        <div className="flex bg-gray-100 rounded-full p-0.5">
                            <button
                                onClick={() => handleExport('paper')}
                                className="p-2 text-purple-600 hover:bg-white rounded-full transition-all shadow-sm"
                                title="Download Question Paper"
                            >
                                <Download className="w-5 h-5" />
                            </button>
                            <div className="w-px bg-gray-300 my-1 mx-0.5"></div>
                            <button
                                onClick={() => handleExport('key')}
                                className="p-2 text-orange-600 hover:bg-white rounded-full transition-all shadow-sm"
                                title="Download Answer Key"
                            >
                                <FileKey className="w-5 h-5" />
                            </button>
                        </div>

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
                        <span>{examType}</span>
                         <span className="font-normal text-gray-500">| {examName}</span>
                    </div>
                    <div>
                         <span>Time: {time}</span>
                    </div>
                    <div className={clsx(totalMarks !== declaredTotalMarks && "text-red-600")}>
                        <span>Total Marks: {toBengali(totalMarks)} / {toBengali(declaredTotalMarks)}</span>
                        {totalMarks !== declaredTotalMarks && (
                            <AlertTriangle className="inline w-4 h-4 ml-1" />
                        )}
                    </div>
                </div>
            </div>

            {/* Content Area */}
            {sections.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-4">
                    <div className="bg-blue-50 p-4 rounded-full mb-2">
                        <Sparkles className="w-12 h-12 text-blue-500" />
                    </div>
                    <p className="text-lg font-medium text-gray-600">No Sections Added</p>
                    <button
                        onClick={handleAddSection}
                        className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-full font-bold shadow-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Add Section
                    </button>
                </div>
            ) : (
                <div className="space-y-6 p-4">
                   {sections.map((section) => {
                       const questionsInSection = selectedQuestions.filter(q => q.sectionId === section.id);

                       return (
                           <div key={section.id}>
                                <div className="mb-2 font-bold text-gray-800 text-lg border-b-2 border-gray-100 pb-1 flex justify-between items-end group/section">
                                    <div className="flex items-center gap-2">
                                        <span>{section.title}</span>
                                        <button
                                            onClick={() => handleEditSection(section)}
                                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors opacity-0 group-hover/section:opacity-100"
                                            title="Edit Section"
                                        >
                                            <Settings className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => removeSection(section.id)}
                                            className="p-1 text-gray-400 hover:text-red-600 transition-colors opacity-0 group-hover/section:opacity-100"
                                            title="Delete Section"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <span className="text-sm font-normal text-gray-500">
                                        Answer any {toBengali(section.questionsToAttempt)} questions ({toBengali(section.marksPerQuestion)} × {toBengali(section.questionsToAttempt)} = {toBengali(section.marksPerQuestion * section.questionsToAttempt)})
                                    </span>
                                </div>

                                <DroppableSection id={section.id}>
                                    <SortableContext
                                        items={questionsInSection.map(q => q.id)}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        {questionsInSection.length === 0 ? (
                                            <div className="text-center py-4 text-xs text-gray-300 italic border border-dashed rounded">
                                                Drag {section.questionType} questions here
                                            </div>
                                        ) : (
                                            questionsInSection.map((q, index) => {
                                                const globalIndex = selectedQuestions.findIndex(sq => sq.id === q.id);
                                                return (
                                                    <SortableExamItem
                                                        key={q.id}
                                                        id={q.id}
                                                        question={q}
                                                        index={index}
                                                        globalIndex={globalIndex}
                                                        section={section}
                                                        editingId={editingId}
                                                        editTitle={editTitle}
                                                        editMarks={editMarks}
                                                        setEditTitle={setEditTitle}
                                                        setEditMarks={setEditMarks}
                                                        startEditing={startEditing}
                                                        saveEdit={saveEdit}
                                                        cancelEdit={cancelEdit}
                                                        setQuestionForRichEdit={setQuestionForRichEdit}
                                                        removeQuestion={removeQuestion}
                                                    />
                                                );
                                            })
                                        )}
                                    </SortableContext>
                                </DroppableSection>
                           </div>
                       );
                   })}

                   {/* Add Section Button at bottom */}
                   <button
                        onClick={handleAddSection}
                        className="w-full py-2 border-2 border-dashed border-gray-300 rounded text-gray-500 hover:border-blue-500 hover:text-blue-500 font-semibold transition-colors flex items-center justify-center gap-2"
                   >
                        <Plus className="w-5 h-5" />
                        Add New Section
                   </button>
                </div>
            )}

            {/* Footer */}
            <div className="mt-auto pt-8 text-center text-sm text-gray-400 font-medium border-t border-gray-100">
                <p>Generated by ExamBuilder</p>
                <p className="text-xs mt-1">Best of Luck</p>
            </div>
        </div>
      </div>

      {showPreview && (
          <PreviewModal
            onClose={() => setShowPreview(false)}
            schoolName={schoolName}
          />
      )}

      {isSectionModalOpen && (
          <SectionModal
             initialConfig={editingSection || undefined}
             onSave={handleSaveSection}
             onClose={() => setIsSectionModalOpen(false)}
          />
      )}

      {questionForRichEdit && (
          <QuestionEditorModal
              question={questionForRichEdit}
              onSave={handleSaveRichEdit}
              onClose={() => setQuestionForRichEdit(null)}
          />
      )}

      {/* Drag Overlay */}
      <DragOverlay>
        {activeId ? (
            activeId.toString().startsWith('bank-') ? (
                 <div className="bg-white p-3 rounded-md shadow-lg border-2 border-blue-500 opacity-90 w-[300px]">
                    Drag Item
                 </div>
            ) : (
                <div className="bg-white p-3 rounded shadow-md border border-gray-200">
                    Question Item
                </div>
            )
        ) : null}
      </DragOverlay>

      {/* Hidden Print Templates */}
      <div className="fixed top-0 left-0 -z-50 opacity-0 pointer-events-none overflow-hidden h-0 w-0">
         <PrintablePaper ref={printPaperRef} examMeta={examMeta} sections={sections} questions={selectedQuestions} />
         <PrintableAnswerKey ref={printKeyRef} examMeta={examMeta} sections={sections} questions={selectedQuestions} />
      </div>
    </div>
    </DndContext>
  );
};
