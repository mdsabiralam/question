import React from 'react';
import { CloudUpload } from 'lucide-react';
import { useDashboard } from '@/context/DashboardContext';
import { motion, AnimatePresence } from 'framer-motion';

export const SyncIndicator = () => {
  const { isSyncing } = useDashboard();

  return (
    <AnimatePresence>
      {isSyncing && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="fixed top-4 right-4 bg-white shadow-md border border-gray-200 rounded-full px-4 py-2 flex items-center gap-2 z-50 text-sm font-medium text-gray-700"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          >
            <CloudUpload className="w-4 h-4 text-blue-500" />
          </motion.div>
          <span>Cloud Syncing...</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
