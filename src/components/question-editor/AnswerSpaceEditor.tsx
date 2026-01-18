"use client";

import React from 'react';
import { AnswerSpaceContent } from '@/types';

interface AnswerSpaceEditorProps {
    content: AnswerSpaceContent;
    onChange: (c: AnswerSpaceContent) => void;
}

export const AnswerSpaceEditor = ({ content, onChange }: AnswerSpaceEditorProps) => {
    return (
        <div className="space-y-3 p-3 bg-gray-50 rounded border">
            <div className="flex gap-4">
                <label className="flex items-center gap-2">
                    <input
                        type="radio"
                        checked={content.type === 'line'}
                        onChange={() => onChange({ ...content, type: 'line', count: content.count || 3 })}
                    />
                    <span className="text-sm">Lines</span>
                </label>
                <label className="flex items-center gap-2">
                    <input
                        type="radio"
                        checked={content.type === 'box'}
                        onChange={() => onChange({ ...content, type: 'box', height: content.height || '100px' })}
                    />
                    <span className="text-sm">Box</span>
                </label>
            </div>

            {content.type === 'line' ? (
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Number of Lines</label>
                    <input
                        type="number"
                        min="1" max="20"
                        value={content.count}
                        onChange={(e) => onChange({ ...content, count: parseInt(e.target.value) || 1 })}
                        className="w-full p-2 border rounded"
                    />
                </div>
            ) : (
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Box Height</label>
                    <select
                        value={content.height}
                        onChange={(e) => onChange({ ...content, height: e.target.value })}
                        className="w-full p-2 border rounded"
                    >
                        <option value="50px">Small (50px)</option>
                        <option value="100px">Medium (100px)</option>
                        <option value="200px">Large (200px)</option>
                        <option value="300px">Full Page (300px)</option>
                    </select>
                </div>
            )}
        </div>
    );
};
