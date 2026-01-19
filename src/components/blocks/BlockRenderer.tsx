/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { Block } from '@/types';
import { MathRenderer } from './MathRenderer';
import { AnswerSpaceRenderer } from './AnswerSpaceRenderer';

export const BlockRenderer = ({ block }: { block: Block }) => {
  switch (block.type) {
    case 'Text':
      return <div className="whitespace-pre-wrap text-gray-800">{block.content.text}</div>;

    case 'Math':
      return <MathRenderer content={block.content} />;

    case 'Image':
      return (
        <div className="my-2 flex flex-col items-center">
            <img
                src={block.content.url}
                alt="Question Image"
                className="max-w-full h-auto max-h-64 object-contain border border-gray-200 rounded"
            />
            {block.content.caption && (
                <p className="text-sm text-gray-500 mt-1 italic">{block.content.caption}</p>
            )}
        </div>
      );

    case 'Drawing':
      return (
        <div className="my-2 flex flex-col items-center">
            {block.content.dataUrl ? (
                <img
                    src={block.content.dataUrl}
                    alt="Drawing"
                    className="max-w-full h-auto max-h-64 object-contain border border-gray-200 rounded bg-white"
                />
            ) : (
                <div className="text-gray-400 text-xs p-4 border border-dashed rounded">Empty Drawing</div>
            )}
        </div>
      );

    case 'AnswerSpace':
      return <AnswerSpaceRenderer content={block.content} />;

    default:
      return null;
  }
};
