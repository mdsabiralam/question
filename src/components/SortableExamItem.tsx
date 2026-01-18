import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Question } from '@/types';
import { Trash2, Check, X, GripVertical } from 'lucide-react';
import { toBengali } from '@/utils/helpers';

interface SortableExamItemProps {
  question: Question;
  serial: string;
  onRemove: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Question>) => void;
  isOverlay?: boolean;
}

export const SortableExamItem = ({ question, serial, onRemove, onUpdate, isOverlay }: SortableExamItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
      id: question.id,
      data: {
          type: 'ExamQuestion',
          question,
          source: 'paper'
      }
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(question.title);
  const [editMarks, setEditMarks] = useState(question.marks);

  const handleSaveEdit = (e: React.MouseEvent) => {
      e.stopPropagation();
      onUpdate(question.id, { title: editTitle, marks: editMarks });
      setIsEditing(false);
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsEditing(false);
      setEditTitle(question.title);
      setEditMarks(question.marks);
  };

  // If it's an overlay, we render a static version (snapshot)
  if (isOverlay) {
      return (
        <div className="p-3 border border-blue-500 bg-white rounded shadow-lg flex justify-between items-start w-full opacity-90 cursor-grabbing">
             <div className="flex gap-3">
                <span className="font-bold text-gray-500 min-w-[20px]">{serial}.</span>
                <div>
                    <p className="text-gray-900 font-medium">{question.title}</p>
                </div>
            </div>
            <span className="text-sm font-semibold text-gray-600">{toBengali(question.marks)}</span>
        </div>
      );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-3 border border-gray-100 rounded hover:bg-gray-50 group relative transition-all touch-none ${isDragging ? 'opacity-30' : ''}`}
    >
        {/* Drag Handle (Entire card is sortable via listeners, but maybe we want a handle?)
            Actually, let's make the whole card draggable for now, but usually for sorting lists a handle is better
            if there are interactive elements like inputs.
            Since we have an edit mode with inputs, we should be careful.
            If editing, we should probably disable dragging or use a handle.
        */}

      {/* Remove Button */}
      {!isEditing && (
        <button
            onClick={(e) => { e.stopPropagation(); onRemove(question.id); }}
            className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-opacity z-10"
            title="Remove Question"
        >
            <Trash2 className="w-4 h-4" />
        </button>
      )}

      {isEditing ? (
        <div className="flex flex-col gap-2 w-full pr-8 cursor-default">
            <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="border border-gray-300 rounded p-1 text-sm w-full"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()} // Prevent sortable interference
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
                        onKeyDown={(e) => e.stopPropagation()}
                    />
                </div>
                <div className="flex gap-2">
                    <button onClick={handleSaveEdit} className="text-green-600 hover:text-green-700">
                        <Check className="w-4 h-4" />
                    </button>
                    <button onClick={handleCancelEdit} className="text-gray-400 hover:text-gray-600">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
      ) : (
        <div
            className="flex justify-between items-start w-full pr-6 cursor-grab active:cursor-grabbing"
            {...attributes}
            {...listeners}
            onClick={() => setIsEditing(true)}
        >
             <div className="flex gap-3">
                {/* Visual Handle Icon (optional, but good for indicating draggability) */}
                <GripVertical className="w-4 h-4 text-gray-300 mt-1 flex-shrink-0" />

                <span className="font-bold text-gray-500 min-w-[20px]">
                    {serial}.
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
