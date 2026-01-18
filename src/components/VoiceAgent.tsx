import React, { useState, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboard } from '@/context/DashboardContext';

// Define SpeechRecognition types globally for this file
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export const VoiceAgent = () => {
  const [isListening, setIsListening] = useState(false);
  const { addQuestion, questionBank } = useDashboard();
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  const handleVoiceCommand = () => {
    if (isListening) {
       recognitionRef.current?.stop();
       return;
    }

    startListening();
  };

  const startListening = () => {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
        alert("Your browser does not support Voice Recognition. Please use Chrome or Edge.");
        return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = false; // Stop after one command
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => {
        setIsListening(true);
        setTranscript('Listening...');
    };

    recognition.onresult = (event: any) => {
        const last = event.results.length - 1;
        const command = event.results[last][0].transcript;
        setTranscript(`"${command}"`);
        handleProcessCommand(command);
    };

    recognition.onerror = (event: any) => {
        console.error("Voice Error:", event.error);
        if (event.error === 'no-speech') {
             setTranscript('No speech detected.');
        } else {
             setTranscript('Error listening.');
        }
        setIsListening(false);
    };

    recognition.onend = () => {
        setIsListening(false);
        // Clear transcript after a delay
        setTimeout(() => setTranscript(''), 3000);
    };

    recognition.start();
  };

  const handleProcessCommand = (command: string) => {
    const cmd = command.toLowerCase();

    // Logic: "Add 5 hard questions"
    if (cmd.includes('add') && cmd.includes('hard') && cmd.includes('questions')) {
        // Extract number? or default to 5
        const limit = 5;

        // Filter from Context Question Bank
        const hardQuestions = questionBank.filter(q => q.difficulty === 'Hard');

        if (hardQuestions.length === 0) {
            setTranscript("No hard questions found.");
            return;
        }

        let addedCount = 0;
        for (const q of hardQuestions) {
            if (addedCount >= limit) break;
            addQuestion(q);
            addedCount++;
        }
        setTranscript(`Added ${addedCount} Hard Questions`);
    } else if (cmd.includes('add') && cmd.includes('questions')) {
         // Generic add
         let addedCount = 0;
         for (const q of questionBank) {
             if (addedCount >= 5) break;
             addQuestion(q);
             addedCount++;
         }
         setTranscript(`Added ${addedCount} Questions`);
    } else {
        setTranscript("Command not recognized.");
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      <AnimatePresence>
        {transcript && (
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
