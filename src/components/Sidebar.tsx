import React from 'react';
import { BookOpen, FileText, Settings } from 'lucide-react';
import clsx from 'clsx';

export const Sidebar = () => {
  return (
    <div className="w-16 md:w-64 h-screen bg-gray-900 text-white flex flex-col border-r border-gray-800">
      <div className="p-4 flex items-center justify-center md:justify-start font-bold text-xl">
        <span className="hidden md:block">ExamBuilder</span>
        <span className="md:hidden">EB</span>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-2">
          <li>
            <a href="#" className={clsx("flex items-center p-3 hover:bg-gray-800 transition-colors", "justify-center md:justify-start")}>
              <BookOpen className="w-6 h-6" />
              <span className="hidden md:block ml-3">Question Bank</span>
            </a>
          </li>
          <li>
            <a href="#" className={clsx("flex items-center p-3 hover:bg-gray-800 transition-colors", "justify-center md:justify-start")}>
              <FileText className="w-6 h-6" />
              <span className="hidden md:block ml-3">Drafts</span>
            </a>
          </li>
          <li>
            <a href="#" className={clsx("flex items-center p-3 hover:bg-gray-800 transition-colors", "justify-center md:justify-start")}>
              <Settings className="w-6 h-6" />
              <span className="hidden md:block ml-3">Settings</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};
