import React from 'react';
import { Question } from '@/types';
import { GripVertical } from 'lucide-react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface QuestionCardProps {
  question: Question;
  isOverlay?: boolean;
}

// Separate Dumb Component for View
export const QuestionCardView = ({ question, isDragging, isOverlay }: { question: Question, isDragging?: boolean, isOverlay?: boolean }) => {
    return (
        <div
            className={`bg-white p-3 rounded-md shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing mb-3 group touch-none ${isDragging ? 'opacity-50' : ''} ${isOverlay ? 'shadow-lg border-blue-500 opacity-90 cursor-grabbing' : ''}`}
        >
            <div className="flex items-start gap-2">
                <GripVertical className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{question.title}</h3>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        <span className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">{question.type}</span>
                        <span className="font-semibold text-gray-700">{question.marks} Marks</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const QuestionCard = ({ question, isOverlay }: QuestionCardProps) => {
  const draggableId = `bank-${question.id}`;

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: draggableId,
    data: {
      type: 'Question',
      question,
      source: 'bank'
    },
    disabled: isOverlay // Disable logic if used as overlay (though we should use View directly)
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  if (isOverlay) {
      return <QuestionCardView question={question} isOverlay />;
  }

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
    >
      <QuestionCardView question={question} isDragging={isDragging} />
    </div>
  );
};
