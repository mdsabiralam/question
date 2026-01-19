/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { X, Save, ArrowRight, ArrowLeft, Type, Calculator, Image as ImageIcon, CheckSquare, Trash2, ArrowUp, ArrowDown, PenTool } from 'lucide-react';
import { Block, BlockType } from '@/types';
import { BlockRenderer } from './blocks/BlockRenderer';
import { DrawingCanvas } from './blocks/DrawingCanvas';

interface QuestionCreatorProps {
  onClose: () => void;
}

export const QuestionCreator = ({ onClose }: QuestionCreatorProps) => {
  const { classes, questionTypes, createQuestion, selectedClass: contextSelectedClass, selectedSubject: contextSelectedSubject } = useDashboard();

  // Steps State
  const [step, setStep] = useState(1);

  // Step 1-3 State
  const [selectedClassId, setSelectedClassId] = useState(contextSelectedClass || classes[0]?.id || '');
  const [selectedSubject, setSelectedSubject] = useState(contextSelectedSubject || '');
  const [selectedType, setSelectedType] = useState(questionTypes[0] || '');

  // Step 4 State (Details)
  const [questionTitle, setQuestionTitle] = useState('');
  const [questionMarks, setQuestionMarks] = useState(1);
  const [questionDifficulty, setQuestionDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [modelAnswer, setModelAnswer] = useState('');

  // Block Editor State
  const [blocks, setBlocks] = useState<Block[]>([]);

  // Derived state
  const currentClass = classes.find(c => c.id === selectedClassId);
  const availableSubjects = currentClass ? currentClass.subjects : [];

  // Reset subject if class changes
  useEffect(() => {
    if (currentClass && !currentClass.subjects.includes(selectedSubject)) {
        setSelectedSubject(currentClass.subjects[0] || '');
    }
  }, [selectedClassId, currentClass, selectedSubject]);

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSave = () => {
    if (!questionTitle && blocks.length === 0) return;

    const finalTitle = questionTitle || (blocks.find(b => b.type === 'Text')?.content.text.substring(0, 50) + '...') || 'New Question';

    createQuestion({
        id: crypto.randomUUID(),
        title: finalTitle,
        blocks: blocks,
        answer: modelAnswer,
        class: selectedClassId,
        subject: selectedSubject,
        type: selectedType,
        marks: questionMarks,
        difficulty: questionDifficulty
    });
    onClose();
  };

  // Block Management
  const addBlock = (type: BlockType) => {
      const newBlock: Block = {
          id: crypto.randomUUID(),
          type,
          content: {}
      };

      if (type === 'Text') newBlock.content = { text: '' };
      if (type === 'Math') newBlock.content = { top: '', bottom: '', operator: '+' };
      if (type === 'Image') newBlock.content = { url: '', caption: '' };
      if (type === 'AnswerSpace') newBlock.content = { type: 'Lines', count: 3 };
      if (type === 'Drawing') newBlock.content = { dataUrl: '' };

      setBlocks([...blocks, newBlock]);
  };

  const removeBlock = (id: string) => {
      setBlocks(blocks.filter(b => b.id !== id));
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
      if (direction === 'up' && index > 0) {
          const newBlocks = [...blocks];
          [newBlocks[index], newBlocks[index - 1]] = [newBlocks[index - 1], newBlocks[index]];
          setBlocks(newBlocks);
      }
      if (direction === 'down' && index < blocks.length - 1) {
          const newBlocks = [...blocks];
          [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
          setBlocks(newBlocks);
      }
  };

  const updateBlockContent = (id: string, newContent: any) => {
      setBlocks(blocks.map(b => b.id === id ? { ...b, content: { ...b.content, ...newContent } } : b));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl flex flex-col overflow-hidden max-h-[95vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">Create New Question</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-100 h-2">
            <div
                className="bg-blue-600 h-2 transition-all duration-300"
                style={{ width: `${(step / 4) * 100}%` }}
            />
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto bg-gray-50/50">
            {step === 1 && (
                <div className="max-w-lg mx-auto space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700">Select Class</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {classes.map(cls => (
                            <button
                                key={cls.id}
                                onClick={() => setSelectedClassId(cls.id)}
                                className={`p-3 rounded border text-left transition-all ${
                                    selectedClassId === cls.id
                                    ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold ring-2 ring-blue-200'
                                    : 'border-gray-200 hover:border-gray-300 hover:bg-white'
                                }`}
                            >
                                {cls.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="max-w-lg mx-auto space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700">Select Subject</h3>
                    {availableSubjects.length > 0 ? (
                        <div className="grid grid-cols-2 gap-3">
                            {availableSubjects.map(sub => (
                                <button
                                    key={sub}
                                    onClick={() => setSelectedSubject(sub)}
                                    className={`p-3 rounded border text-left transition-all ${
                                        selectedSubject === sub
                                        ? 'border-green-500 bg-green-50 text-green-700 font-semibold ring-2 ring-green-200'
                                        : 'border-gray-200 hover:border-gray-300 hover:bg-white'
                                    }`}
                                >
                                    {sub}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <p className="text-red-500">No subjects found for this class. Please add subjects in Settings.</p>
                    )}
                </div>
            )}

            {step === 3 && (
                <div className="max-w-lg mx-auto space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700">Select Question Type</h3>
                    <div className="grid grid-cols-1 gap-2">
                        {questionTypes.map(type => (
                            <button
                                key={type}
                                onClick={() => setSelectedType(type)}
                                className={`p-3 rounded border text-left transition-all ${
                                    selectedType === type
                                    ? 'border-purple-500 bg-purple-50 text-purple-700 font-semibold ring-2 ring-purple-200'
                                    : 'border-gray-200 hover:border-gray-300 hover:bg-white'
                                }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {step === 4 && (
                <div className="flex gap-6 h-full">
                    {/* Left: Editor */}
                    <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2">
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                            <label className="block text-xs font-bold text-gray-500 mb-1">Question Title (Search/Summary)</label>
                            <input
                                type="text"
                                value={questionTitle}
                                onChange={(e) => setQuestionTitle(e.target.value)}
                                className="w-full border-b border-gray-300 focus:border-blue-500 outline-none py-1"
                                placeholder="Enter a short title..."
                            />
                        </div>

                        {/* Blocks */}
                        {blocks.map((block, index) => (
                            <div key={block.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 relative group">
                                {/* Block Controls */}
                                <div className="absolute right-2 top-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                    <button onClick={() => moveBlock(index, 'up')} disabled={index === 0} className="p-1 hover:bg-gray-100 rounded text-gray-500 disabled:opacity-30"><ArrowUp className="w-4 h-4"/></button>
                                    <button onClick={() => moveBlock(index, 'down')} disabled={index === blocks.length - 1} className="p-1 hover:bg-gray-100 rounded text-gray-500 disabled:opacity-30"><ArrowDown className="w-4 h-4"/></button>
                                    <button onClick={() => removeBlock(block.id)} className="p-1 hover:bg-red-50 rounded text-red-500"><Trash2 className="w-4 h-4"/></button>
                                </div>

                                {/* Content Editors */}
                                {block.type === 'Text' && (
                                    <textarea
                                        value={block.content.text}
                                        onChange={(e) => updateBlockContent(block.id, { text: e.target.value })}
                                        className="w-full border-none focus:ring-0 p-0 resize-none outline-none text-gray-800"
                                        placeholder="Type question text here..."
                                        rows={3}
                                    />
                                )}

                                {block.type === 'Math' && (
                                    <div className="flex items-center gap-4 bg-gray-50 p-2 rounded">
                                        <div className="flex flex-col gap-1 w-20">
                                            <input
                                                placeholder="Top"
                                                className="border rounded p-1 text-center font-mono"
                                                value={block.content.top}
                                                onChange={(e) => updateBlockContent(block.id, { top: e.target.value })}
                                            />
                                            <input
                                                placeholder="Bot"
                                                className="border rounded p-1 text-center font-mono"
                                                value={block.content.bottom}
                                                onChange={(e) => updateBlockContent(block.id, { bottom: e.target.value })}
                                            />
                                        </div>
                                        <select
                                            className="border rounded p-1 font-bold text-xl"
                                            value={block.content.operator}
                                            onChange={(e) => updateBlockContent(block.id, { operator: e.target.value })}
                                        >
                                            <option value="+">+</option>
                                            <option value="-">-</option>
                                            <option value="×">×</option>
                                            <option value="÷">÷</option>
                                        </select>
                                        <div className="text-gray-400 text-xs ml-auto">Preview on right</div>
                                    </div>
                                )}

                                {block.type === 'Drawing' && (
                                    <DrawingCanvas
                                        initialData={block.content.dataUrl}
                                        onSave={(dataUrl) => updateBlockContent(block.id, { dataUrl })}
                                        onOCR={(text) => {
                                            // Handle OCR result - maybe replace this block with Text or add Text block below?
                                            // For now, let's just log or alert, or update caption?
                                            // Let's create a NEW Text block below this one?
                                            // Or just update 'canvasData' (not implemented).
                                            // Let's assume onOCR updates 'caption' for now as a workaround since we can't easily add block from here without passing props.
                                            // Actually, `onOCR` could prompt to add a text block.
                                            alert(`OCR Result: ${text}. (Copy this to a Text block if needed)`);
                                        }}
                                    />
                                )}

                                {block.type === 'Image' && (
                                    <div className="flex flex-col gap-2">
                                        <input
                                            type="text"
                                            placeholder="Image URL (e.g., https://via.placeholder.com/150)"
                                            className="border rounded p-2 text-sm"
                                            value={block.content.url}
                                            onChange={(e) => updateBlockContent(block.id, { url: e.target.value })}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Caption (Optional)"
                                            className="border rounded p-2 text-sm"
                                            value={block.content.caption}
                                            onChange={(e) => updateBlockContent(block.id, { caption: e.target.value })}
                                        />
                                    </div>
                                )}

                                {block.type === 'AnswerSpace' && (
                                    <div className="flex gap-4 items-center bg-gray-50 p-2 rounded">
                                        <select
                                            value={block.content.type}
                                            onChange={(e) => updateBlockContent(block.id, { type: e.target.value })}
                                            className="border rounded p-1 text-sm"
                                        >
                                            <option value="Lines">Lines</option>
                                            <option value="Box">Box</option>
                                        </select>
                                        {block.content.type === 'Lines' ? (
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-600">Count:</span>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="20"
                                                    value={block.content.count}
                                                    onChange={(e) => updateBlockContent(block.id, { count: parseInt(e.target.value) })}
                                                    className="border rounded p-1 w-16 text-sm"
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-600">Height:</span>
                                                <select
                                                    value={block.content.height}
                                                    onChange={(e) => updateBlockContent(block.id, { height: e.target.value })}
                                                    className="border rounded p-1 text-sm"
                                                >
                                                    <option value="50px">Small (50px)</option>
                                                    <option value="100px">Medium (100px)</option>
                                                    <option value="200px">Large (200px)</option>
                                                </select>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Add Block Buttons */}
                        <div className="grid grid-cols-5 gap-2 mt-2">
                            <button onClick={() => addBlock('Text')} className="flex items-center justify-center gap-2 p-2 border-2 border-dashed border-gray-300 rounded hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 transition-colors text-gray-500 text-sm font-medium">
                                <Type className="w-4 h-4" /> Text
                            </button>
                            <button onClick={() => addBlock('Math')} className="flex items-center justify-center gap-2 p-2 border-2 border-dashed border-gray-300 rounded hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 transition-colors text-gray-500 text-sm font-medium">
                                <Calculator className="w-4 h-4" /> Math
                            </button>
                            <button onClick={() => addBlock('Drawing')} className="flex items-center justify-center gap-2 p-2 border-2 border-dashed border-gray-300 rounded hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 transition-colors text-gray-500 text-sm font-medium">
                                <PenTool className="w-4 h-4" /> Draw
                            </button>
                            <button onClick={() => addBlock('Image')} className="flex items-center justify-center gap-2 p-2 border-2 border-dashed border-gray-300 rounded hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 transition-colors text-gray-500 text-sm font-medium">
                                <ImageIcon className="w-4 h-4" /> Image
                            </button>
                            <button onClick={() => addBlock('AnswerSpace')} className="flex items-center justify-center gap-2 p-2 border-2 border-dashed border-gray-300 rounded hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 transition-colors text-gray-500 text-sm font-medium">
                                <CheckSquare className="w-4 h-4" /> Space
                            </button>
                        </div>
                    </div>

                    {/* Right: Preview & Meta */}
                    <div className="w-80 bg-gray-50 border-l border-gray-200 p-4 flex flex-col gap-6 overflow-y-auto">
                        <div>
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Live Preview</h4>
                            <div className="bg-white border border-gray-200 shadow-sm p-4 rounded min-h-[100px]">
                                {blocks.length > 0 ? (
                                    blocks.map(b => <BlockRenderer key={b.id} block={b} />)
                                ) : (
                                    <p className="text-gray-400 text-sm italic text-center py-4">Add blocks to see preview</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4 border-t border-gray-200 pt-4">
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Metadata</h4>

                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-600">Model Answer (Key)</label>
                                <textarea
                                    value={modelAnswer}
                                    onChange={(e) => setModelAnswer(e.target.value)}
                                    className="w-full border border-gray-300 rounded p-2 text-sm h-20"
                                    placeholder="Enter correct answer for Answer Key..."
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-600">Marks</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={questionMarks}
                                    onChange={(e) => setQuestionMarks(Math.max(1, parseInt(e.target.value) || 0))}
                                    className="w-full border border-gray-300 rounded p-2 bg-white"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-600">Difficulty</label>
                                <select
                                    value={questionDifficulty}
                                    onChange={(e) => setQuestionDifficulty(e.target.value as any)}
                                    className="w-full border border-gray-300 rounded p-2 bg-white"
                                >
                                    <option value="Easy">Easy</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Hard">Hard</option>
                                </select>
                            </div>

                            <div className="text-xs text-gray-500 space-y-1">
                                <p><strong>Class:</strong> {classes.find(c => c.id === selectedClassId)?.name}</p>
                                <p><strong>Subject:</strong> {selectedSubject}</p>
                                <p><strong>Type:</strong> {selectedType}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-between">
            {step > 1 ? (
                <button
                    onClick={handleBack}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-200 rounded"
                >
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>
            ) : (
                <div /> // Spacer
            )}

            {step < 4 ? (
                <button
                    onClick={handleNext}
                    disabled={
                        (step === 1 && !selectedClassId) ||
                        (step === 2 && !selectedSubject) ||
                        (step === 3 && !selectedType)
                    }
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next <ArrowRight className="w-4 h-4" />
                </button>
            ) : (
                <button
                    onClick={handleSave}
                    disabled={!questionTitle && blocks.length === 0}
                    className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Save className="w-4 h-4" /> Save Question
                </button>
            )}
        </div>
      </div>
    </div>
  );
};
