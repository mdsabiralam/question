import React from 'react';
import { Question } from '@/types';
import { GripVertical } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
}

export const QuestionCard = ({ question }: QuestionCardProps) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('questionId', question.id);
    e.dataTransfer.setData('source', 'draft');
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="bg-white p-3 rounded-md shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing mb-3 group touch-none"
    >
      <div className="flex items-start gap-2">
        <GripVertical className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
        <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{question.title}</h3>
            <div className="flex flex-wrap items-center gap-1.5 mt-2 text-xs text-gray-500">
                <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded border border-blue-100">{question.class}</span>
                <span className="px-1.5 py-0.5 bg-green-50 text-green-600 rounded border border-green-100">{question.subject}</span>
                <span className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600 border border-gray-200">{question.type}</span>
                <span className="font-semibold text-gray-700 ml-auto">{question.marks} M</span>
            </div>
        </div>
      </div>
    </div>
  );
};
