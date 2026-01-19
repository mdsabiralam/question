"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Eraser, Pen, RefreshCw, Wand2, Type } from 'lucide-react';
import clsx from 'clsx';

interface DrawingCanvasProps {
  initialData?: string;
  onSave: (dataUrl: string) => void;
  onOCR?: (text: string) => void;
}

export const DrawingCanvas = ({ initialData, onSave, onOCR }: DrawingCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(2);
  const [isAiProcessing, setIsAiProcessing] = useState(false);

  useEffect(() => {
    // Restore initial drawing if available (basic support)
    if (initialData && canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        const img = new Image();
        img.onload = () => {
            ctx?.drawImage(img, 0, 0);
        };
        img.src = initialData;
    }
  }, []);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const pos = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pos = getPos(e, canvas);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
        setIsDrawing(false);
        saveCanvas();
    }
  };

  const getPos = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = (e as React.MouseEvent).clientX;
        clientY = (e as React.MouseEvent).clientY;
    }

    return {
        x: clientX - rect.left,
        y: clientY - rect.top
    };
  };

  const clearCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      saveCanvas();
  };

  const saveCanvas = () => {
      const canvas = canvasRef.current;
      if (canvas) {
          onSave(canvas.toDataURL());
      }
  };

  const handleAiFix = () => {
      if (!confirm("Start AI enhancement? (Simulated cost: 1 credit)")) return;
      setIsAiProcessing(true);
      setTimeout(() => {
          setIsAiProcessing(false);
          alert("AI Enhancement applied (Simulated: Smoothed lines)");
      }, 1000);
  };

  const handleOCR = () => {
      setIsAiProcessing(true);
      setTimeout(() => {
          setIsAiProcessing(false);
          if (onOCR) onOCR("Simulated OCR Text: 220 + 032 = 252");
      }, 1500);
  };

  return (
    <div className="flex flex-col gap-2 border border-gray-200 rounded p-2 bg-gray-50">
        <div className="flex justify-between items-center bg-white p-2 rounded shadow-sm border border-gray-100">
            <div className="flex gap-2">
                <button
                    onClick={() => setColor('#000000')}
                    className={clsx("p-2 rounded hover:bg-gray-100", color === '#000000' && "bg-gray-200")}
                    title="Pen"
                >
                    <Pen className="w-4 h-4" />
                </button>
                <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border-none"
                />
                <button
                    onClick={clearCanvas}
                    className="p-2 rounded hover:bg-red-50 text-red-500"
                    title="Clear"
                >
                    <Eraser className="w-4 h-4" />
                </button>
            </div>

            <div className="flex gap-2">
                <button
                    onClick={handleAiFix}
                    className="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded text-xs font-bold hover:bg-indigo-100 transition-colors"
                    disabled={isAiProcessing}
                >
                    <Wand2 className="w-3 h-3" />
                    AI Fix
                </button>
                <button
                    onClick={handleOCR}
                    className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-600 rounded text-xs font-bold hover:bg-green-100 transition-colors"
                    disabled={isAiProcessing}
                >
                    <Type className="w-3 h-3" />
                    OCR
                </button>
            </div>
        </div>

        <canvas
            ref={canvasRef}
            width={500}
            height={300}
            className="bg-white border border-gray-300 rounded shadow-inner touch-none cursor-crosshair w-full"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
        />

        {isAiProcessing && (
            <div className="text-center text-xs text-indigo-500 font-medium animate-pulse">
                Processing...
            </div>
        )}
    </div>
  );
};
