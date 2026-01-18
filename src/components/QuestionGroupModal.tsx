"use client";

import React, { useState, useEffect, useRef } from 'react';
import { QuestionGroup } from '@/types';
import { toBengali } from '@/utils/helpers';
import clsx from 'clsx';
import { X, Calculator } from 'lucide-react';

interface QuestionGroupModalProps {
  initialConfig?: QuestionGroup;
  type: 'MCQ' | 'Short Answer' | 'Creative';
  onTypeChange?: (type: 'MCQ' | 'Short Answer' | 'Creative') => void;
  onSave: (group: QuestionGroup) => void;
  onClose: () => void;
  startPosition?: { x: number; y: number };
}

export const QuestionGroupModal = ({ initialConfig, type, onTypeChange, onSave, onClose, startPosition }: QuestionGroupModalProps) => {
  // State
  const [marksPerQuestion, setMarksPerQuestion] = useState(initialConfig?.marksPerQuestion || 1);
  const [totalToAnswer, setTotalToAnswer] = useState(initialConfig?.totalToAnswer || 1);
  const [totalInGroup, setTotalInGroup] = useState(initialConfig?.totalInGroup || 1);
  const [error, setError] = useState<string | null>(null);

  // Dragging State
  const modalRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(startPosition || { x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent<HTMLHeadingElement>) => {
    setIsDragging(true);
    dragStartPos.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragStartPos.current.x,
          y: e.clientY - dragStartPos.current.y
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleSave = () => {
    if (totalToAnswer > totalInGroup) {
      setError('Total to answer cannot exceed total questions.');
      return;
    }
    setError(null);
    onSave({
      id: initialConfig?.id || crypto.randomUUID(),
      type,
      marksPerQuestion,
      totalToAnswer,
      totalInGroup
    });
  };

  const totalMarks = marksPerQuestion * totalToAnswer;

  return (
    <div
      className="fixed inset-0 z-50 pointer-events-none" // Overlay allows clicks through except on modal
    >
      <div
        ref={modalRef}
        style={{
            left: position.x,
            top: position.y,
            opacity: isDragging ? 0.6 : 1,
            transform: 'translate(0, 0)' // Ensure absolute positioning works simply
        }}
        className={clsx(
            "absolute bg-white rounded-lg shadow-2xl border border-gray-200 w-80 pointer-events-auto",
            "transition-opacity duration-150"
        )}
      >
        {/* Draggable Header */}
        <div
          onMouseDown={handleMouseDown}
          className="bg-gray-100 p-3 rounded-t-lg font-bold text-gray-700 flex justify-between items-center cursor-move select-none border-b border-gray-200"
        >
          <div className="flex items-center gap-2" onMouseDown={(e) => e.stopPropagation()}>
             {/* Type Selector within Header */}
             <select
               value={type}
               onChange={(e) => onTypeChange && onTypeChange(e.target.value as 'MCQ' | 'Short Answer' | 'Creative')}
               className="bg-transparent border-none font-bold text-gray-700 focus:ring-0 cursor-pointer"
             >
                <option value="MCQ">MCQ</option>
                <option value="Short Answer">Short Answer</option>
                <option value="Creative">Creative</option>
             </select>
             <span>Settings</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600" onMouseDown={(e) => e.stopPropagation()}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Marks per Question</label>
            <input
              type="number"
              min="1"
              value={marksPerQuestion}
              onChange={(e) => setMarksPerQuestion(Math.max(1, parseInt(e.target.value) || 0))}
              className="w-full border p-2 rounded text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
             <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">To Answer</label>
                <input
                  type="number"
                  min="1"
                  value={totalToAnswer}
                  onChange={(e) => setTotalToAnswer(Math.max(1, parseInt(e.target.value) || 0))}
                  className="w-full border p-2 rounded text-sm"
                />
             </div>
             <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Total Group</label>
                <input
                  type="number"
                  min="1"
                  value={totalInGroup}
                  onChange={(e) => setTotalInGroup(Math.max(1, parseInt(e.target.value) || 0))}
                  className="w-full border p-2 rounded text-sm"
                />
             </div>
          </div>

          {error && (
            <div className="text-red-500 text-xs bg-red-50 p-2 rounded border border-red-100">
                {error}
            </div>
          )}

          {/* Live Preview */}
          <div className="bg-blue-50 p-3 rounded border border-blue-100 text-center">
            <div className="flex items-center justify-center gap-2 text-blue-800 font-medium mb-1">
                <Calculator className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wide">Live Preview</span>
            </div>
            <div className="text-xl font-bold text-blue-900">
                {toBengali(marksPerQuestion)} × {toBengali(totalToAnswer)} = {toBengali(totalMarks)}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button onClick={onClose} className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded">
                Cancel
            </button>
            <button onClick={handleSave} className="px-3 py-1.5 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded shadow-sm">
                Save Config
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
