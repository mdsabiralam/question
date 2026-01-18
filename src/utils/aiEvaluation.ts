import { ExamMeta } from '@/types';

export interface AIAnalysis {
    suggestedMarks: number;
    feedback: string;
}

export const analyzeAnswer = (
    studentAnswer: string,
    modelAnswer: string,
    totalMarks: number,
    examMeta: ExamMeta
): AIAnalysis => {
    if (!studentAnswer.trim()) return { suggestedMarks: 0, feedback: "No answer provided." };

    // Simple keyword matching heuristic
    const keywords = modelAnswer.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g,"").split(/\s+/).filter(w => w.length > 3);
    const studentWords = studentAnswer.toLowerCase();

    let matchCount = 0;
    keywords.forEach(k => {
        if (studentWords.includes(k)) matchCount++;
    });

    // If model answer is short/empty, assume length based grading?
    const matchRatio = keywords.length > 0 ? matchCount / keywords.length : (studentAnswer.length > 10 ? 0.5 : 0);

    // Base marks logic
    let marks = Math.min(totalMarks, Math.round(totalMarks * (matchRatio + 0.2))); // Bonus for effort
    if (matchRatio < 0.2) marks = Math.max(0, marks - 1); // Penalty for low relevance

    // Tone & Board Logic
    const isStrict = ['Annual Exam', 'First Terminal', 'Second Terminal'].some(t => examMeta.examType.includes(t));
    const isWB = examMeta.board === 'WB';

    let feedback = "";

    if (marks >= totalMarks * 0.8) {
        feedback = isStrict
            ? "Accurate and comprehensive. Key points covered."
            : "Great answer! You covered all the main points perfectly.";
    } else if (marks >= totalMarks * 0.5) {
        feedback = isStrict
            ? "Partially correct. Lacks depth in explanation."
            : "Good start! Try to explain a bit more to get full marks.";
    } else {
        feedback = isStrict
            ? "Incomplete or irrelevant. Review the topic."
            : "Nice try! Review the topic again and you'll do better.";
    }

    // Board-specific localization (Mock)
    if (isWB) {
        if (marks >= totalMarks * 0.8) feedback = "চমৎকার উত্তর। (Excellent) " + feedback;
        else if (marks >= totalMarks * 0.5) feedback = "ভালো চেষ্টা। (Good Attempt) " + feedback;
        else feedback = "আরও ভালো করতে হবে। (Needs Improvement) " + feedback;
    }

    return { suggestedMarks: marks, feedback };
};
