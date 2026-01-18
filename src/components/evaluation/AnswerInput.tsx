"use client";

import React, { useState, useRef } from 'react';
import { Mic, Image as ImageIcon, Type, Loader2 } from 'lucide-react';
import Tesseract from 'tesseract.js';

interface AnswerInputProps {
    answer: string;
    onAnswerChange: (text: string) => void;
}

export const AnswerInput = ({ answer, onAnswerChange }: AnswerInputProps) => {
    const [mode, setMode] = useState<'text' | 'image' | 'voice'>('text');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<any>(null);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsProcessing(true);
        try {
            const { data: { text } } = await Tesseract.recognize(file, 'eng+ben');
            onAnswerChange(text);
        } catch (err) {
            console.error(err);
            alert("OCR Failed");
        } finally {
            setIsProcessing(false);
        }
    };

    const toggleVoice = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
            return;
        }

        if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            alert("Voice not supported");
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.lang = 'bn-BD';
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event: any) => {
            const transcript = Array.from(event.results)
                .map((result: any) => result[0].transcript)
                .join('');
            onAnswerChange(transcript);
        };

        recognition.start();
        setIsListening(true);
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-2 border-b">
                <button
                    onClick={() => setMode('text')}
                    className={`px-4 py-2 flex items-center gap-2 ${mode === 'text' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
                >
                    <Type className="w-4 h-4" /> Text
                </button>
                <button
                    onClick={() => setMode('image')}
                    className={`px-4 py-2 flex items-center gap-2 ${mode === 'image' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
                >
                    <ImageIcon className="w-4 h-4" /> Image (OCR)
                </button>
                <button
                    onClick={() => setMode('voice')}
                    className={`px-4 py-2 flex items-center gap-2 ${mode === 'voice' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
                >
                    <Mic className="w-4 h-4" /> Voice
                </button>
            </div>

            <div className="p-4 bg-gray-50 rounded border min-h-[150px]">
                {mode === 'text' && (
                    <textarea
                        value={answer}
                        onChange={(e) => onAnswerChange(e.target.value)}
                        className="w-full h-32 p-2 border rounded resize-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Paste or type student answer..."
                    />
                )}

                {mode === 'image' && (
                    <div className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded hover:bg-gray-100 relative">
                        {isProcessing ? (
                            <div className="flex flex-col items-center gap-2">
                                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                                <span className="text-sm text-gray-500">Processing OCR...</span>
                            </div>
                        ) : (
                            <>
                                <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                                <span className="text-sm text-gray-500">Click to upload answer sheet</span>
                                <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                            </>
                        )}
                    </div>
                )}

                {mode === 'voice' && (
                    <div className="flex flex-col items-center justify-center h-32 gap-4">
                        <button
                            onClick={toggleVoice}
                            className={`p-4 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-blue-600'} text-white shadow-lg`}
                        >
                            <Mic className="w-6 h-6" />
                        </button>
                        <p className="text-sm text-gray-500">{isListening ? 'Listening... (Speak in Bengali/English)' : 'Click to Record'}</p>
                    </div>
                )}
            </div>

            {(mode === 'image' || mode === 'voice') && (
                <div className="mt-4">
                    <label className="text-xs font-bold text-gray-500 uppercase">Converted Text (Editable)</label>
                    <textarea
                        value={answer}
                        onChange={(e) => onAnswerChange(e.target.value)}
                        className="w-full h-32 p-2 border rounded mt-1 text-sm bg-white"
                        placeholder="Converted text will appear here..."
                    />
                </div>
            )}
        </div>
    );
};
