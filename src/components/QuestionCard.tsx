import React from 'react';
import { Question } from '@/types';
import { GripVertical } from 'lucide-react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface QuestionCardProps {
  question: Question;
}

export const QuestionCard = ({ question }: QuestionCardProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `bank-${question.id}`,
    data: {
      type: 'Question',
      source: 'bank', // 'draft' in original code, changing to 'bank' or keeping 'draft' for consistency? Memory says 'bank-'. Original code used 'draft'. Let's use 'bank' as source type but keeping 'draft' in logic might be confusing. I'll stick to 'bank' source in data.
      question: question,
    }
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  if (isDragging) {
      return (
        <div
            ref={setNodeRef}
            style={style}
            className="bg-white p-3 rounded-md shadow-lg border-2 border-blue-500 opacity-80 mb-3"
        >
             <div className="flex items-start gap-2">
                <GripVertical className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{question.title}</h3>
                </div>
            </div>
        </div>
      );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bg-white p-3 rounded-md shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing mb-3 group"
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
