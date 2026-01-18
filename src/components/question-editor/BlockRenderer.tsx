"use client";

import React, { useEffect, useRef } from 'react';
import { QuestionBlock, MathBlockContent, ImageBlockContent, AnswerSpaceContent } from '@/types';
import katex from 'katex';
import 'katex/dist/katex.min.css';

const MathRenderer = ({ content }: { content: MathBlockContent }) => {
    const containerRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            try {
                katex.render(content.latex, containerRef.current, {
                    throwOnError: false,
                    displayMode: true // Default to display mode for clearer view
                });
            } catch (e) {
                console.error(e);
            }
        }
    }, [content.latex]);

    return <span ref={containerRef} />;
};

export const BlockRenderer = ({ block }: { block: QuestionBlock }) => {
    switch (block.type) {
        case 'text':
            return <div className="whitespace-pre-wrap mb-2 text-gray-800">{block.content as string}</div>;
        case 'math':
            return <div className="mb-2"><MathRenderer content={block.content as MathBlockContent} /></div>;
        case 'image':
            const imgContent = block.content as ImageBlockContent;
            return (
                <div className="mb-2 flex flex-col items-center">
                    <img src={imgContent.url} alt="Question Image" className="max-w-full h-auto max-h-60 rounded border" />
                    {imgContent.caption && <p className="text-sm text-gray-500 mt-1">{imgContent.caption}</p>}
                </div>
            );
        case 'answer_space':
            const ansContent = block.content as AnswerSpaceContent;
            if (ansContent.type === 'line') {
                return (
                    <div className="mb-2 space-y-3 pt-2">
                        {Array.from({ length: ansContent.count || 1 }).map((_, i) => (
                            <div key={i} className="border-b border-gray-400 h-6 w-full"></div>
                        ))}
                    </div>
                );
            } else {
                return (
                    <div
                        className="mb-2 border border-gray-400 w-full bg-gray-50/50"
                        style={{ height: ansContent.height || '100px' }}
                    ></div>
                );
            }
        default:
            return null;
    }
};
