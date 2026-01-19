import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Question, Section } from '@/types';
import { PenTool, Trash2, Check, X } from 'lucide-react';
import { BlockRenderer } from './question-editor/BlockRenderer';
import { formatSerial, toBengali } from '@/utils/helpers';

interface SortableExamItemProps {
  id: string;
  question: Question;
  index: number;
  section: Section;
  globalIndex: number;
  editingId: string | null;
  editTitle: string;
  editMarks: number;
  setEditTitle: (val: string) => void;
  setEditMarks: (val: number) => void;
  startEditing: (q: { id: string; title: string; marks: number }) => void;
  saveEdit: (id: string) => void;
  cancelEdit: () => void;
  setQuestionForRichEdit: (q: Question) => void;
  removeQuestion: (id: string) => void;
}

export const SortableExamItem = ({
  id,
  question,
  index,
  section,
  globalIndex,
  editingId,
  editTitle,
  editMarks,
  setEditTitle,
  setEditMarks,
  startEditing,
  saveEdit,
  cancelEdit,
  setQuestionForRichEdit,
  removeQuestion
}: SortableExamItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : 'auto',
  };

  return (
    <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="p-3 border border-gray-100 rounded hover:bg-gray-50 group relative transition-all bg-white"
    >
        <div className="absolute right-2 top-2 flex gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
                onClick={(e) => { e.stopPropagation(); setQuestionForRichEdit(question); }}
                className="text-blue-400 hover:text-blue-600 bg-white rounded-full p-1 shadow-sm"
                title="Advanced Editor"
                onPointerDown={(e) => e.stopPropagation()} // Prevent drag start
            >
                <PenTool className="w-4 h-4" />
            </button>
            <button
                onClick={(e) => { e.stopPropagation(); removeQuestion(question.id); }}
                className="text-red-400 hover:text-red-600 bg-white rounded-full p-1 shadow-sm"
                title="Remove"
                onPointerDown={(e) => e.stopPropagation()} // Prevent drag start
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </div>

        {/* Edit Mode Inline */}
        {editingId === question.id ? (
            <div className="flex flex-col gap-2 w-full pr-16" onPointerDown={(e) => e.stopPropagation()}>
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
                        <button onClick={() => saveEdit(question.id)} className="text-green-600 hover:text-green-700">
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
                onClick={() => startEditing(question)}
                className="flex justify-between items-start cursor-pointer w-full pr-6"
                title="Click to edit title or use Advanced Editor for blocks"
            >
                <div className="flex gap-3 w-full">
                    <span className="font-bold text-gray-500 min-w-[20px]">
                        {formatSerial(index, section.numberingStyle)}.
                    </span>
                    <div className="w-full">
                        {question.blocks && question.blocks.length > 0 ? (
                            <div>
                                {question.blocks.map(block => <BlockRenderer key={block.id} block={block} />)}
                            </div>
                        ) : (
                            <p className="text-gray-900 font-medium whitespace-pre-wrap">{question.title}</p>
                        )}
                    </div>
                </div>
                <span className="text-sm font-semibold text-gray-600 shrink-0">{toBengali(question.marks)}</span>
            </div>
        )}
    </div>
  );
};
