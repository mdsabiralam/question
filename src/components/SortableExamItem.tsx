import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Question } from '@/types';
import { formatSerial, toBengali } from '@/utils/helpers';
import { Trash2, Check, X } from 'lucide-react';
import clsx from 'clsx';

interface SortableExamItemProps {
  id: string;
  question: Question;
  index: number;
  numberingFormat: 'english' | 'bengali' | 'roman';
  onRemove: (id: string) => void;
  onEdit: (q: any) => void; // Using any for simplicity as it matches parent logic
  editingId: string | null;
  editTitle: string;
  setEditTitle: (val: string) => void;
  editMarks: number;
  setEditMarks: (val: number) => void;
  saveEdit: (id: string) => void;
  cancelEdit: () => void;
}

export const SortableExamItem = ({
  id,
  question,
  index,
  numberingFormat,
  onRemove,
  onEdit,
  editingId,
  editTitle,
  setEditTitle,
  editMarks,
  setEditMarks,
  saveEdit,
  cancelEdit
}: SortableExamItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 999 : 'auto',
    position: 'relative' as const, // Fix for z-index
  };

  const isEditing = editingId === question.id;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={clsx(
        "p-3 border border-gray-100 rounded hover:bg-gray-50 group relative transition-all touch-none bg-white",
        isDragging && "shadow-xl border-blue-200"
      )}
    >
        {/* Remove Button - Stop propagation to prevent drag start */}
        <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onRemove(question.id); }}
            className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-opacity z-10"
            title="Remove Question"
        >
            <Trash2 className="w-4 h-4" />
        </button>

        {isEditing ? (
            <div className="flex flex-col gap-2 w-full pr-8 cursor-default" onPointerDown={(e) => e.stopPropagation()}>
                <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="border border-gray-300 rounded p-1 text-sm w-full"
                />
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Marks:</span>
                        <input
                            type="number"
                            value={editMarks}
                            onChange={(e) => setEditMarks(Number(e.target.value))}
                            className="border border-gray-300 rounded p-1 text-sm w-16"
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
                onClick={() => onEdit(question)}
                className="flex justify-between items-start cursor-grab active:cursor-grabbing w-full pr-6"
                title="Click to edit, Drag to reorder"
            >
                <div className="flex gap-3">
                    <span className="font-bold text-gray-500 min-w-[20px]">
                        {formatSerial(index, numberingFormat)}.
                    </span>
                    <div>
                        <p className="text-gray-900 font-medium">{question.title}</p>
                    </div>
                </div>
                <span className="text-sm font-semibold text-gray-600">{toBengali(question.marks)}</span>
            </div>
        )}
    </div>
  );
};
