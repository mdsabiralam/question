import React, { useState } from 'react';
import { BookOpen, FileText, Settings, Menu, ClipboardCheck } from 'lucide-react';
import clsx from 'clsx';
import { useDashboard } from '@/context/DashboardContext';

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { setCurrentView, currentView } = useDashboard();

  return (
    <>
        {/* Mobile Toggle */}
        <button
            className="md:hidden fixed top-4 left-4 z-50 text-gray-800 bg-white p-2 rounded shadow"
            onClick={() => setIsOpen(!isOpen)}
        >
            <Menu className="w-6 h-6" />
        </button>

    <div className={clsx(
        "fixed md:static inset-y-0 left-0 z-40 w-64 bg-gray-900 text-white flex flex-col border-r border-gray-800 transition-transform duration-300 transform",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
    )}>
      <div className="p-4 flex items-center justify-center md:justify-start font-bold text-xl">
        <span className="block">ExamBuilder</span>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-2">
          <li>
            <button
                onClick={() => setCurrentView('builder')}
                className={clsx(
                    "w-full flex items-center p-3 hover:bg-gray-800 transition-colors justify-start",
                    currentView === 'builder' && "bg-gray-800 border-l-4 border-blue-500"
                )}
            >
              <BookOpen className="w-6 h-6" />
              <span className="block ml-3">Builder</span>
            </button>
          </li>
          <li>
            <button
                onClick={() => setCurrentView('evaluation')}
                className={clsx(
                    "w-full flex items-center p-3 hover:bg-gray-800 transition-colors justify-start",
                    currentView === 'evaluation' && "bg-gray-800 border-l-4 border-purple-500"
                )}
            >
              <ClipboardCheck className="w-6 h-6" />
              <span className="block ml-3">Evaluation (AI)</span>
            </button>
          </li>
          <li>
            <a href="#" className="flex items-center p-3 hover:bg-gray-800 transition-colors justify-start">
              <FileText className="w-6 h-6" />
              <span className="block ml-3">Drafts</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center p-3 hover:bg-gray-800 transition-colors justify-start">
              <Settings className="w-6 h-6" />
              <span className="block ml-3">Settings</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>

    {/* Overlay for mobile */}
    {isOpen && (
        <div
            className="fixed inset-0 z-30 bg-black/50 md:hidden"
            onClick={() => setIsOpen(false)}
        />
    )}
    </>
  );
};
