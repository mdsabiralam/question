/* eslint-disable @next/next/no-img-element */
import React, { useState, useRef } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { Question } from '@/types';
import { evaluateAnswer } from '@/utils/aiEvaluator';
import { X, Mic, Image as ImageIcon, FileText, Brain, Check, Edit2, Loader2 } from 'lucide-react';
import clsx from 'clsx';

interface EvaluationModalProps {
  onClose: () => void;
}

export const EvaluationModal = ({ onClose }: EvaluationModalProps) => {
  const { selectedQuestions, examMeta } = useDashboard();

  const [selectedQuestionId, setSelectedQuestionId] = useState<string>(selectedQuestions[0]?.id || '');
  const [inputMode, setInputMode] = useState<'text' | 'image' | 'voice'>('text');

  const [studentAnswer, setStudentAnswer] = useState('');
  const [ocrImage, setOcrImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [evaluation, setEvaluation] = useState<{ marks: number, feedback: string } | null>(null);

  const selectedQuestion = selectedQuestions.find(q => q.id === selectedQuestionId);

  // Simulated OCR
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          setOcrImage(URL.createObjectURL(file));
          setIsProcessing(true);
          // Simulate OCR processing
          setTimeout(() => {
              setStudentAnswer("Simulated OCR Text: The answer involves photosynthesis process where plants make food using sunlight...");
              setIsProcessing(false);
              setInputMode('text'); // Switch to text to show result
          }, 2000);
      }
  };

  // Simulated Voice
  const handleVoiceRecord = () => {
      setIsProcessing(true);
      setTimeout(() => {
          setStudentAnswer("Simulated Voice Input: The answer is 4 because 2 plus 2 equals 4.");
          setIsProcessing(false);
          setInputMode('text');
      }, 2000);
  };

  const handleEvaluate = async () => {
      if (!selectedQuestion) return;
      setIsProcessing(true);
      const result = await evaluateAnswer(selectedQuestion, studentAnswer, examMeta);
      setEvaluation({ marks: result.marks, feedback: result.feedback });
      setIsProcessing(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] flex overflow-hidden">
        {/* Left: Input */}
        <div className="w-1/2 border-r border-gray-200 flex flex-col bg-gray-50">
            <div className="p-4 border-b border-gray-200 bg-white">
                <h3 className="font-bold text-gray-700 mb-2">Select Question</h3>
                <select
                    value={selectedQuestionId}
                    onChange={(e) => { setSelectedQuestionId(e.target.value); setEvaluation(null); setStudentAnswer(''); }}
                    className="w-full border rounded p-2 text-sm"
                >
                    {selectedQuestions.map((q, idx) => (
                        <option key={q.id} value={q.id}>Q{idx + 1}: {q.title.substring(0, 40)}...</option>
                    ))}
                </select>
                {selectedQuestion && (
                    <div className="mt-2 text-xs text-gray-500 bg-blue-50 p-2 rounded border border-blue-100">
                        <strong>Model Answer:</strong> {selectedQuestion.answer || "Not provided"}
                    </div>
                )}
            </div>

            <div className="flex-1 p-4 flex flex-col">
                <div className="flex gap-2 mb-4">
                    <button
                        onClick={() => setInputMode('text')}
                        className={clsx("flex-1 py-2 rounded text-sm font-medium flex items-center justify-center gap-2 transition-colors", inputMode === 'text' ? "bg-blue-600 text-white" : "bg-white border hover:bg-gray-100")}
                    >
                        <FileText className="w-4 h-4" /> Text
                    </button>
                    <button
                        onClick={() => setInputMode('image')}
                        className={clsx("flex-1 py-2 rounded text-sm font-medium flex items-center justify-center gap-2 transition-colors", inputMode === 'image' ? "bg-blue-600 text-white" : "bg-white border hover:bg-gray-100")}
                    >
                        <ImageIcon className="w-4 h-4" /> Image/OCR
                    </button>
                    <button
                        onClick={() => handleVoiceRecord()}
                        className={clsx("flex-1 py-2 rounded text-sm font-medium flex items-center justify-center gap-2 transition-colors", inputMode === 'voice' ? "bg-blue-600 text-white" : "bg-white border hover:bg-gray-100")}
                    >
                        <Mic className="w-4 h-4" /> Voice
                    </button>
                </div>

                {inputMode === 'text' && (
                    <textarea
                        value={studentAnswer}
                        onChange={(e) => setStudentAnswer(e.target.value)}
                        className="flex-1 w-full border border-gray-300 rounded p-3 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                        placeholder="Type student answer or paste here..."
                    />
                )}

                {inputMode === 'image' && (
                    <div className="flex-1 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center bg-gray-100 relative">
                        {ocrImage ? (
                            <img src={ocrImage} alt="Uploaded" className="max-h-full max-w-full object-contain" />
                        ) : (
                            <div className="text-center p-6">
                                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-500 text-sm">Upload handwritten answer</p>
                                <input type="file" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                            </div>
                        )}
                        {isProcessing && (
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                <div className="bg-white p-3 rounded shadow flex items-center gap-2">
                                    <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                                    <span>Processing OCR...</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div className="mt-4">
                    <button
                        onClick={handleEvaluate}
                        disabled={!studentAnswer || isProcessing}
                        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold shadow-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Brain className="w-5 h-5" />}
                        Analyze with AI
                    </button>
                </div>
            </div>
        </div>

        {/* Right: Evaluation */}
        <div className="w-1/2 flex flex-col bg-white">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                <h2 className="text-lg font-bold text-gray-800">AI Evaluation</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
                {evaluation ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Score Card */}
                        <div className="flex items-center gap-4">
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center w-32">
                                <div className="text-xs text-blue-600 font-bold uppercase">Marks</div>
                                <div className="text-4xl font-extrabold text-blue-700 mt-1">
                                    <input
                                        type="number"
                                        value={evaluation.marks}
                                        onChange={(e) => setEvaluation({ ...evaluation, marks: parseInt(e.target.value) || 0 })}
                                        className="w-16 text-center bg-transparent border-b border-blue-300 focus:border-blue-600 outline-none"
                                    />
                                    <span className="text-xl text-gray-400">/{selectedQuestion?.marks}</span>
                                </div>
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-800 mb-1 flex items-center gap-2">
                                    <Edit2 className="w-4 h-4 text-gray-400" />
                                    Teacher Feedback
                                </h4>
                                <textarea
                                    value={evaluation.feedback}
                                    onChange={(e) => setEvaluation({ ...evaluation, feedback: e.target.value })}
                                    className="w-full h-24 border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>

                        {/* Tone & Board Info */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-3 rounded border text-xs">
                                <span className="font-bold block text-gray-500 mb-1">Exam Mode</span>
                                <span className="text-gray-800 font-medium">{examMeta.examType} ({examMeta.examType.toLowerCase().includes('class') ? 'Coaching Tone' : 'Strict Tone'})</span>
                            </div>
                            <div className="bg-gray-50 p-3 rounded border text-xs">
                                <span className="font-bold block text-gray-500 mb-1">Board Style</span>
                                <span className="text-gray-800 font-medium">{examMeta.board} ({examMeta.board === 'CBSE' ? 'Point-based' : 'Descriptive'})</span>
                            </div>
                        </div>

                        {/* Save Button */}
                        <button className="w-full bg-green-600 text-white py-3 rounded-lg font-bold shadow hover:bg-green-700 flex items-center justify-center gap-2">
                            <Check className="w-5 h-5" />
                            Finalize Marks & Save
                        </button>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                        <Brain className="w-16 h-16 mb-4 opacity-20" />
                        <p>Enter student answer and click Analyze</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};
