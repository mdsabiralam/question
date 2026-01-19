"use client";

import React, { useEffect, useRef, useState } from 'react';
import { DrawingBlockContent } from '@/types';
import { Pencil, Trash2, Sparkles, Type, Image as ImageIcon, Loader2 } from 'lucide-react';
import Tesseract from 'tesseract.js';

interface DrawingBlockEditorProps {
    content: DrawingBlockContent;
    onChange: (c: DrawingBlockContent) => void;
}

export const DrawingBlockEditor = ({ content, onChange }: DrawingBlockEditorProps) => {
    const canvasEl = useRef<HTMLCanvasElement>(null);
    const fabricCanvas = useRef<any>(null);
    const [isDrawing, setIsDrawing] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        let fabricLib: any;
        try {
            fabricLib = require('fabric').fabric;
        } catch (e) {
            console.error("Fabric load error", e);
            return;
        }

        if (!canvasEl.current || !fabricLib) return;

        const canvas = new fabricLib.Canvas(canvasEl.current, {
            isDrawingMode: true,
            width: 500,
            height: 300,
            backgroundColor: '#ffffff'
        });

        fabricCanvas.current = canvas;

        if (content.canvasData) {
            canvas.loadFromJSON(content.canvasData, canvas.renderAll.bind(canvas));
        } else if (content.data) {
            fabricLib.Image.fromURL(content.data, (img: any) => {
                canvas.add(img);
            });
        }

        const handleSave = () => {
            const json = canvas.toJSON();
            const dataUrl = canvas.toDataURL({ format: 'png', quality: 0.8 });
            onChange({ ...content, data: dataUrl, canvasData: json });
        };

        canvas.on('path:created', handleSave);
        canvas.on('object:modified', handleSave);
        canvas.on('object:added', handleSave);

        return () => {
            canvas.dispose();
        };
    }, []);

    useEffect(() => {
        if (fabricCanvas.current) {
            fabricCanvas.current.isDrawingMode = isDrawing;
        }
    }, [isDrawing]);

    const clear = () => {
        fabricCanvas.current?.clear();
        fabricCanvas.current?.setBackgroundColor('#ffffff', () => {});
        const json = fabricCanvas.current.toJSON();
        onChange({ ...content, data: '', canvasData: json });
    };

    const handleRecognize = async () => {
        if (!fabricCanvas.current) return;
        setIsProcessing(true);
        try {
            const dataUrl = fabricCanvas.current.toDataURL();
            const { data: { text } } = await Tesseract.recognize(dataUrl, 'eng+ben');
            alert(`Recognized Text: ${text}`);
        } catch (e) {
            console.error(e);
            alert("Recognition failed");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleAIFix = () => {
        alert("This feature uses 1 Credit. (Mock: Shapes smoothed!)");
    };

    const handleAIArt = () => {
        alert("This feature uses 1 Credit. (Mock: Sketch to Art!)");
    };

    return (
        <div className="space-y-2">
            <div className="flex gap-2 mb-2 flex-wrap">
                <button
                    onClick={() => setIsDrawing(!isDrawing)}
                    className={`p-2 rounded border flex items-center gap-2 ${isDrawing ? 'bg-blue-100 border-blue-500' : 'bg-white'}`}
                >
                    <Pencil className="w-4 h-4" /> {isDrawing ? 'Stop Drawing' : 'Draw'}
                </button>
                <button onClick={clear} className="p-2 rounded border bg-white hover:bg-red-50 text-red-600">
                    <Trash2 className="w-4 h-4" /> Clear
                </button>

                <button onClick={handleRecognize} className="p-2 rounded border bg-white hover:bg-gray-50 flex items-center gap-1">
                    {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Type className="w-4 h-4" />}
                    টেক্সট কনভার্ট (ফ্রি)
                </button>

                <button onClick={handleAIFix} className="p-2 rounded border bg-purple-50 text-purple-700 flex items-center gap-1 border-purple-200">
                    <Sparkles className="w-4 h-4" /> AI ফিক্স <span className="bg-purple-200 text-[10px] px-1 rounded">1 Credit</span>
                </button>
                <button onClick={handleAIArt} className="p-2 rounded border bg-orange-50 text-orange-700 flex items-center gap-1 border-orange-200">
                    <ImageIcon className="w-4 h-4" /> AI আর্ট <span className="bg-orange-200 text-[10px] px-1 rounded">1 Credit</span>
                </button>
            </div>

            <div className="border rounded overflow-hidden shadow-inner bg-gray-50" style={{ touchAction: 'none' }}>
                <canvas ref={canvasEl} />
            </div>
            <p className="text-xs text-gray-400">ড্রইং ক্যানভাস (Drawing Canvas)</p>
        </div>
    );
};
