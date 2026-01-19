import axios from 'axios';
import { ExamMeta } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface AIAnalysis {
    suggestedMarks: number;
    feedback: string;
}

export const analyzeAnswer = async (
    studentAnswer: string,
    modelAnswer: string,
    totalMarks: number,
    examMeta: ExamMeta
): Promise<AIAnalysis> => {
    try {
        const prompt = {
            studentAnswer,
            modelAnswer,
            totalMarks,
            examType: examMeta.examType,
            board: examMeta.board
        };

        const response = await axios.post(`${API_URL}/api/ai-completion`, { prompt });
        return response.data.result;
    } catch (error) {
        console.error("AI Analysis Failed:", error);
        return {
            suggestedMarks: 0,
            feedback: "Error connecting to AI service. Please try again."
        };
    }
};
