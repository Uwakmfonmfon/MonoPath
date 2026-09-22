import React from 'react';
import TaskBoard from '@/app/components/dashboard/TaskBoard';
import AssistantPanel from '@/app/components/assistant/AssistantPanel';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-100 flex h-screen overflow-hidden">
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900">Your Current Path</h1>
          <p className="text-slate-600">Focus on the next decisive step.</p>
        </header>
        <TaskBoard />
      </main>

      {/* Side Panel for Assistant */}
      <aside className="w-96 bg-white border-l border-slate-200 shadow-xl flex flex-col">
        <AssistantPanel />
      </aside>
    </div>
  );
}
