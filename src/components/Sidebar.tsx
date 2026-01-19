import React, { useState } from 'react';
import { BookOpen, FileText, Settings, Menu } from 'lucide-react';
import clsx from 'clsx';

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

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
            <a href="#" className="flex items-center p-3 hover:bg-gray-800 transition-colors justify-start">
              <BookOpen className="w-6 h-6" />
              <span className="block ml-3">Question Bank</span>
            </a>
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
