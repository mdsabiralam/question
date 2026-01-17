import React, { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboard } from '@/context/DashboardContext';
import { draftQuestions } from '@/data/mockData';

export const VoiceAgent = () => {
  const [isListening, setIsListening] = useState(false);
  const { addQuestion } = useDashboard();
  const [transcript, setTranscript] = useState('');

  const handleVoiceCommand = () => {
    setIsListening(true);
    setTranscript('Listening...');

    // Simulate listening delay
    setTimeout(() => {
        const command = "Add 5 hard questions";
        setTranscript(command);

        // Simulate processing
        setTimeout(() => {
            handleProcessCommand(command);
            setIsListening(false);
            setTranscript('');
        }, 1500);
    }, 2000);
  };

  const handleProcessCommand = (command: string) => {
    // Mock logic: Parse "Add 5 hard questions"
    // We don't have "difficulty" in Question type, but let's just add random questions
    // or filter by some criteria if we had it.
    // For now, let's just add 5 random questions from draftQuestions that aren't already added.

    // Simple mock implementation
    if (command.toLowerCase().includes('add 5')) {
        let addedCount = 0;
        for (const q of draftQuestions) {
            if (addedCount >= 5) break;
            // logic to add would be handled by context checking duplicates usually,
            // but here we force add via context
            addQuestion(q);
            addedCount++;
        }
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      <AnimatePresence>
        {isListening && (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="bg-black text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium mb-2"
            >
                {transcript}
            </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={handleVoiceCommand}
        whileTap={{ scale: 0.9 }}
        className={`p-4 rounded-full shadow-xl transition-colors relative ${
            isListening ? 'bg-red-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
        title="AI Voice Agent"
      >
        {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}

        {isListening && (
            <motion.div
                className="absolute inset-0 rounded-full border-2 border-red-400"
                animate={{ scale: [1, 1.5], opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
            />
        )}
      </motion.button>
    </div>
  );
};
