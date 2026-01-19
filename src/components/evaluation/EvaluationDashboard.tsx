"use client";

import React, { useState } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { AnswerInput } from './AnswerInput';
import { EvaluationResult } from './EvaluationResult';
import { analyzeAnswer, AIAnalysis } from '@/utils/aiEvaluation';
import { ArrowLeft, Sparkles, Loader2 } from 'lucide-react';

export const EvaluationDashboard = () => {
  const { selectedQuestions, examMeta, setCurrentView } = useDashboard();
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);

  const [studentAnswer, setStudentAnswer] = useState('');
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [marks, setMarks] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const selectedQuestion = selectedQuestions.find(q => q.id === selectedQuestionId);

  const handleAnalyze = async () => {
      if (!selectedQuestion) return;
      setIsAnalyzing(true);
      const res = await analyzeAnswer(studentAnswer, selectedQuestion.answer || '', selectedQuestion.marks, examMeta);
      setAnalysis(res);
      setMarks(res.suggestedMarks);
      setFeedback(res.feedback);
      setIsAnalyzing(false);
  };

  if (!selectedQuestionId) {
      return (
          <div className="p-6 h-full flex flex-col">
              <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Select Question to Evaluate</h2>
                  <button
                      onClick={() => setCurrentView('builder')}
                      className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
                  >
                      <ArrowLeft className="w-4 h-4" /> Back to Builder
                  </button>
              </div>
              <div className="grid grid-cols-1 gap-4 overflow-y-auto">
                  {selectedQuestions.map((q, idx) => (
                      <div
                          key={q.id}
                          onClick={() => {
                              setSelectedQuestionId(q.id);
                              setStudentAnswer('');
                              setAnalysis(null);
                              setMarks(0);
                              setFeedback('');
                          }}
                          className="p-4 bg-white border rounded shadow-sm hover:shadow-md cursor-pointer transition-shadow"
                      >
                          <div className="flex justify-between">
                              <span className="font-bold text-gray-600">Q{idx + 1}</span>
                              <span className="text-sm bg-gray-100 px-2 rounded">{q.marks} Marks</span>
                          </div>
                          <p className="mt-2 text-gray-800 line-clamp-2">{q.title}</p>
                      </div>
                  ))}
                  {selectedQuestions.length === 0 && (
                      <div className="text-center text-gray-400 py-10">No questions in the paper.</div>
                  )}
              </div>
          </div>
      );
  }

  return (
      <div className="p-6 h-full flex flex-col overflow-y-auto">
          <div className="flex items-center gap-4 mb-6 border-b pb-4">
              <button
                  onClick={() => setSelectedQuestionId(null)}
                  className="p-2 hover:bg-gray-100 rounded-full"
              >
                  <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                  <span className="text-xs font-bold text-gray-500 uppercase">Evaluating</span>
                  <h2 className="text-xl font-bold text-gray-800 line-clamp-1">{selectedQuestion?.title}</h2>
              </div>
              <div className="ml-auto text-sm font-semibold bg-blue-50 text-blue-700 px-3 py-1 rounded">
                  Max: {selectedQuestion?.marks}
              </div>
          </div>

          <div className="flex-1 space-y-8">
              <section>
                  <h3 className="text-sm font-bold text-gray-600 mb-2 uppercase tracking-wide">1. Input Student Answer</h3>
                  <AnswerInput answer={studentAnswer} onAnswerChange={setStudentAnswer} />
              </section>

              <section>
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wide">2. AI Analysis</h3>
                      <button
                          onClick={handleAnalyze}
                          disabled={!studentAnswer.trim() || isAnalyzing}
                          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded shadow hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                          {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                          {isAnalyzing ? 'Analyzing...' : 'Analyze Answer'}
                      </button>
                  </div>

                  {analysis ? (
                      <EvaluationResult
                          question={selectedQuestion!}
                          studentAnswer={studentAnswer}
                          analysis={analysis}
                          marks={marks}
                          feedback={feedback}
                          onMarksChange={setMarks}
                          onFeedbackChange={setFeedback}
                      />
                  ) : (
                      <div className="p-8 text-center bg-gray-50 border border-dashed rounded text-gray-400">
                          Click "Analyze Answer" to get AI suggestions.
                      </div>
                  )}
              </section>
          </div>
      </div>
  );
};
