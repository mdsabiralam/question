"use client";

import React, { useState, useEffect } from 'react';
import { MathBlockContent } from '@/types';
import { Calculator, Type } from 'lucide-react';

interface MathBlockEditorProps {
    content: MathBlockContent;
    onChange: (c: MathBlockContent) => void;
}

export const MathBlockEditor = ({ content, onChange }: MathBlockEditorProps) => {
    const [mode, setMode] = useState<'latex' | 'visual'>(content.mode || 'latex');
    const [visualData, setVisualData] = useState(content.visualData || { top: '', bottom: '', operator: '+' });

    useEffect(() => {
        if (mode === 'visual') {
            const { top, bottom, operator } = visualData;
            // Generate vertical arithmetic LaTeX
            // Using array environment for alignment
            const latex = `\\begin{array}{r} ${top} \\\\ ${operator} ${bottom} \\\\ \\hline \\end{array}`;
            // Cast operator to specific union type as visualData state is inferred as string but type requires union
            const typedVisualData = { ...visualData, operator: visualData.operator as "+" | "-" | "×" | "÷" };
            onChange({ ...content, mode, visualData: typedVisualData, latex });
        } else {
            onChange({ ...content, mode });
        }
    }, [visualData, mode]); // Depend on data changes

    const handleVisualChange = (field: keyof typeof visualData, value: string) => {
        setVisualData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="space-y-3 p-3 bg-gray-50 rounded border">
            <div className="flex gap-2 border-b pb-2">
                <button
                    onClick={() => setMode('latex')}
                    className={`px-3 py-1 rounded text-sm flex items-center gap-1 ${mode === 'latex' ? 'bg-blue-600 text-white' : 'bg-white border text-gray-700'}`}
                >
                    <Type className="w-4 h-4" /> LaTeX
                </button>
                <button
                    onClick={() => setMode('visual')}
                    className={`px-3 py-1 rounded text-sm flex items-center gap-1 ${mode === 'visual' ? 'bg-blue-600 text-white' : 'bg-white border text-gray-700'}`}
                >
                    <Calculator className="w-4 h-4" /> Visual (Primary)
                </button>
            </div>

            {mode === 'latex' ? (
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">LaTeX Code</label>
                    <textarea
                        value={content.latex}
                        onChange={(e) => onChange({ ...content, latex: e.target.value })}
                        className="w-full p-2 border rounded font-mono text-sm"
                        rows={3}
                        placeholder="\frac{a}{b} or \sqrt{x}"
                    />
                </div>
            ) : (
                <div className="grid grid-cols-3 gap-3 items-end">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Top Number</label>
                        <input
                            type="text"
                            value={visualData.top}
                            onChange={(e) => handleVisualChange('top', e.target.value)}
                            className="w-full p-2 border rounded text-right"
                            placeholder="220"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Operator</label>
                        <select
                            value={visualData.operator}
                            onChange={(e) => handleVisualChange('operator', e.target.value)}
                            className="w-full p-2 border rounded text-center font-bold"
                        >
                            <option value="+">+</option>
                            <option value="-">-</option>
                            <option value="×">×</option>
                            <option value="÷">÷</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Bottom Number</label>
                        <input
                            type="text"
                            value={visualData.bottom}
                            onChange={(e) => handleVisualChange('bottom', e.target.value)}
                            className="w-full p-2 border rounded text-right"
                            placeholder="032"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
