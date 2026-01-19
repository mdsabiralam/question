"use client";

import React, { useState } from 'react';
import { Question, QuestionBlock, BlockType } from '@/types';
import { X, Plus, ArrowUp, ArrowDown, Trash2, Type, Calculator, Image as ImageIcon, BoxSelect, PenTool } from 'lucide-react';
import { MathBlockEditor } from './MathBlockEditor';
import { ImageBlockEditor } from './ImageBlockEditor';
import { AnswerSpaceEditor } from './AnswerSpaceEditor';
import { DrawingBlockEditor } from './DrawingBlockEditor';

interface QuestionEditorModalProps {
  question: Question;
  onSave: (q: Question) => void;
  onClose: () => void;
}

export const QuestionEditorModal = ({ question, onSave, onClose }: QuestionEditorModalProps) => {
  const [blocks, setBlocks] = useState<QuestionBlock[]>(question.blocks || [
      { id: '1', type: 'text', content: question.title }
  ]);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(blocks[0]?.id || null);
  const [answer, setAnswer] = useState(question.answer || '');

  const handleAddBlock = (type: BlockType) => {
      const newBlock: QuestionBlock = {
          id: crypto.randomUUID(),
          type,
          content: getDefaultContent(type)
      };
      setBlocks(prev => [...prev, newBlock]);
      setActiveBlockId(newBlock.id);
  };

  const getDefaultContent = (type: BlockType) => {
      switch (type) {
          case 'text': return '';
          case 'math': return { latex: '', mode: 'latex' };
          case 'image': return { url: '' };
          case 'answer_space': return { type: 'line', count: 3 };
          case 'drawing': return { data: '' };
          default: return '';
      }
  };

  const updateBlock = (id: string, content: any) => {
      setBlocks(prev => prev.map(b => b.id === id ? { ...b, content } : b));
  };

  const removeBlock = (id: string) => {
      setBlocks(prev => prev.filter(b => b.id !== id));
      if (activeBlockId === id) setActiveBlockId(null);
  };

  const moveBlock = (index: number, direction: -1 | 1) => {
      if ((index === 0 && direction === -1) || (index === blocks.length - 1 && direction === 1)) return;
      setBlocks(prev => {
          const newBlocks = [...prev];
          const temp = newBlocks[index];
          newBlocks[index] = newBlocks[index + direction];
          newBlocks[index + direction] = temp;
          return newBlocks;
      });
  };

  const handleSave = () => {
      const firstTextBlock = blocks.find(b => b.type === 'text');
      const fallbackTitle = firstTextBlock ? (firstTextBlock.content as string).substring(0, 100) : "Rich Content Question";

      onSave({
          ...question,
          title: question.title || fallbackTitle,
          blocks,
          answer
      });
      onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[85vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-lg">
            <h2 className="text-lg font-bold text-gray-800">Advanced Question Editor</h2>
            <button onClick={onClose}><X className="w-5 h-5 text-gray-500" /></button>
        </div>

        <div className="flex-1 flex overflow-hidden">
            {/* Sidebar: Block List */}
            <div className="w-1/3 border-r bg-gray-50 flex flex-col">
                <div className="p-3 border-b bg-white flex-1 overflow-y-auto">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Structure</p>
                    <div className="space-y-2">
                        {blocks.map((block, index) => (
                            <div
                                key={block.id}
                                className={`p-2 rounded border cursor-pointer flex justify-between items-center group ${activeBlockId === block.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`}
                                onClick={() => setActiveBlockId(block.id)}
                            >
                                <div className="flex items-center gap-2 overflow-hidden">
                                    {getBlockIcon(block.type)}
                                    <span className="text-sm truncate">
                                        {block.type === 'text' ? (block.content as string).substring(0, 15) || 'Text...' : block.type}
                                    </span>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={(e) => { e.stopPropagation(); moveBlock(index, -1); }} className="p-1 hover:bg-gray-200 rounded"><ArrowUp className="w-3 h-3" /></button>
                                    <button onClick={(e) => { e.stopPropagation(); moveBlock(index, 1); }} className="p-1 hover:bg-gray-200 rounded"><ArrowDown className="w-3 h-3" /></button>
                                    <button onClick={(e) => { e.stopPropagation(); removeBlock(block.id); }} className="p-1 hover:text-red-500 rounded"><Trash2 className="w-3 h-3" /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="p-3 grid grid-cols-2 gap-2 mt-auto border-t">
                    <button onClick={() => handleAddBlock('text')} className="flex items-center justify-center gap-1 p-2 bg-white border hover:bg-gray-100 rounded text-xs font-medium"><Type className="w-4 h-4" /> Text</button>
                    <button onClick={() => handleAddBlock('math')} className="flex items-center justify-center gap-1 p-2 bg-white border hover:bg-gray-100 rounded text-xs font-medium"><Calculator className="w-4 h-4" /> Math</button>
                    <button onClick={() => handleAddBlock('image')} className="flex items-center justify-center gap-1 p-2 bg-white border hover:bg-gray-100 rounded text-xs font-medium"><ImageIcon className="w-4 h-4" /> Image</button>
                    <button onClick={() => handleAddBlock('answer_space')} className="flex items-center justify-center gap-1 p-2 bg-white border hover:bg-gray-100 rounded text-xs font-medium"><BoxSelect className="w-4 h-4" /> Answer</button>
                    <button onClick={() => handleAddBlock('drawing')} className="flex items-center justify-center gap-1 p-2 bg-white border hover:bg-gray-100 rounded text-xs font-medium col-span-2"><PenTool className="w-4 h-4" /> Draw / Sketch</button>
                </div>
            </div>

            {/* Main Editor Area */}
            <div className="flex-1 p-6 overflow-y-auto bg-white">
                {activeBlockId ? (
                    <div className="max-w-2xl mx-auto">
                        <h3 className="text-sm font-bold text-gray-400 uppercase mb-4">
                            Editing {blocks.find(b => b.id === activeBlockId)?.type} Block
                        </h3>
                        {renderEditor(blocks.find(b => b.id === activeBlockId)!, updateBlock)}
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-400">
                        Select a block to edit or add a new one.
                    </div>
                )}
            </div>
        </div>

        {/* Model Answer Section */}
        <div className="p-4 bg-yellow-50 border-t border-yellow-200">
            <label className="block text-xs font-bold text-yellow-800 mb-1 uppercase">Model Answer / Key (Teacher Only)</label>
            <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full h-16 p-2 border border-yellow-300 rounded bg-yellow-50/50 text-sm focus:ring-2 focus:ring-yellow-500 outline-none resize-none"
                placeholder="Enter the correct answer or key points..."
            />
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex justify-end gap-2 rounded-b-lg">
            <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
            <button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold">Save Changes</button>
        </div>
      </div>
    </div>
  );
};

const getBlockIcon = (type: BlockType) => {
    switch (type) {
        case 'text': return <Type className="w-4 h-4 text-gray-500" />;
        case 'math': return <Calculator className="w-4 h-4 text-blue-500" />;
        case 'image': return <ImageIcon className="w-4 h-4 text-green-500" />;
        case 'answer_space': return <BoxSelect className="w-4 h-4 text-purple-500" />;
        case 'drawing': return <PenTool className="w-4 h-4 text-orange-500" />;
    }
};

const renderEditor = (block: QuestionBlock, onUpdate: (id: string, content: any) => void) => {
    switch (block.type) {
        case 'text':
            return (
                <textarea
                    value={block.content as string}
                    onChange={(e) => onUpdate(block.id, e.target.value)}
                    className="w-full h-40 p-3 border rounded focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    placeholder="Type your question text here..."
                />
            );
        case 'math':
            return <MathBlockEditor content={block.content as any} onChange={(c) => onUpdate(block.id, c)} />;
        case 'image':
            return <ImageBlockEditor content={block.content as any} onChange={(c) => onUpdate(block.id, c)} />;
        case 'answer_space':
            return <AnswerSpaceEditor content={block.content as any} onChange={(c) => onUpdate(block.id, c)} />;
        case 'drawing':
            return <DrawingBlockEditor content={block.content as any} onChange={(c) => onUpdate(block.id, c)} />;
        default: return null;
    }
};
