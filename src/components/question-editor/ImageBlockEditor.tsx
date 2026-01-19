"use client";

import React, { useState } from 'react';
import { ImageBlockContent } from '@/types';
import { Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface ImageBlockEditorProps {
    content: ImageBlockContent;
    onChange: (c: ImageBlockContent) => void;
}

export const ImageBlockEditor = ({ content, onChange }: ImageBlockEditorProps) => {
    const [isUploading, setIsUploading] = useState(false);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await axios.post(`${API_URL}/api/sync-cloud`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            onChange({ ...content, url: res.data.url });
        } catch (err) {
            console.error('Upload failed', err);
            alert('Upload failed. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="space-y-3 p-3 bg-gray-50 rounded border">
            {content.url ? (
                <div className="relative">
                    <img src={content.url} alt="Preview" className="max-h-40 rounded mx-auto border" />
                    <button
                        onClick={() => onChange({ ...content, url: '' })}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
                    >
                        Remove
                    </button>
                </div>
            ) : (
                <div className="border-2 border-dashed border-gray-300 rounded p-6 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors relative">
                    {isUploading ? (
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                    ) : (
                        <>
                            <Upload className="w-8 h-8 mb-2" />
                            <span className="text-sm">Click to upload image</span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleUpload}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                        </>
                    )}
                </div>
            )}

            <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Caption (Optional)</label>
                <input
                    type="text"
                    value={content.caption || ''}
                    onChange={(e) => onChange({ ...content, caption: e.target.value })}
                    className="w-full p-2 border rounded text-sm"
                    placeholder="e.g. Figure 1"
                />
            </div>
        </div>
    );
};
