
import { Question } from '@/types';

interface EvaluationResult {
  marks: number;
  feedback: string;
  keyPoints: string[];
}

interface ExamMeta {
    examType: string;
    board: 'WB' | 'CBSE';
}

export const evaluateAnswer = async (
  question: Question,
  studentAnswer: string,
  examMeta: ExamMeta
): Promise<EvaluationResult> => {
  // Simulate AI delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const isClassTest = examMeta.examType.toLowerCase().includes('class') || examMeta.examType.toLowerCase().includes('unit');
  const isCBSE = examMeta.board === 'CBSE';

  let marks = 0;
  let feedback = '';
  let keyPoints = ['Concept Understanding', 'Explanation Depth'];

  // Basic logic based on answer length (Simulation)
  const length = studentAnswer.length;
  const maxMarks = question.marks;

  if (length > 50) marks = maxMarks;
  else if (length > 20) marks = Math.ceil(maxMarks / 2);
  else marks = 0;

  // Tone Adjustment
  if (isClassTest) {
      // Soft, Coaching Tone
      if (marks === maxMarks) {
          feedback = "খুব ভালো হয়েছে! Concept পরিষ্কার। এভাবে চালিয়ে যাও।";
          if (isCBSE) feedback = "Excellent work! Concept is clear. Keep it up.";
      } else if (marks > 0) {
          feedback = "চেষ্টা ভালো, তবে explanation আরেকটু বিস্তারিত হলে ভালো হতো। Key points গুলো খেয়াল রেখো।";
          if (isCBSE) feedback = "Good attempt, but the explanation could be more detailed. Focus on key points.";
      } else {
          feedback = "একটু মনোযোগ দিতে হবে। Basic concept টা আবার দেখে নিও।";
          if (isCBSE) feedback = "Needs attention. Please review the basic concepts.";
      }
  } else {
      // Strict, Examiner Tone
      if (marks === maxMarks) {
          feedback = "সঠিক এবং যথাযথ উত্তর।";
          if (isCBSE) feedback = "Correct and precise answer.";
      } else if (marks > 0) {
          feedback = "উত্তর অসম্পূর্ণ। সঠিক তথ্য ও যুক্তির অভাব রয়েছে।";
          if (isCBSE) feedback = "Incomplete answer. Lacks specific details and logic.";
      } else {
          feedback = "ভুল উত্তর। বিষয়বস্তুর সাথে সামঞ্জস্যপূর্ণ নয়।";
          if (isCBSE) feedback = "Incorrect answer. Irrelevant to the topic.";
      }
  }

  // Board Nuance (WB vs CBSE)
  if (!isCBSE && marks > 0) {
      feedback += " (বানান ও বাক্য গঠনের দিকে নজর দিও)";
  } else if (isCBSE && marks > 0) {
      feedback += " (Ensure points are structured efficiently)";
  }

  return {
      marks,
      feedback,
      keyPoints
  };
};
