"use client";

import React from 'react';
import { Sidebar } from './Sidebar';
import { DashboardProvider } from '@/context/DashboardContext';
import { SyncIndicator } from './SyncIndicator';
import { VoiceAgent } from './VoiceAgent';
import { DragDropPolyfill } from './DragDropPolyfill';

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <DashboardProvider>
      <DragDropPolyfill />
      <div className="flex h-screen overflow-hidden bg-gray-100 relative">
        <Sidebar />
        <main className="flex-1 overflow-hidden flex flex-col">
          <SyncIndicator />
          <div className="flex-1 overflow-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            {children}
          </div>
          <VoiceAgent />
        </main>
      </div>
    </DashboardProvider>
  );
};
