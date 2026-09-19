import React, { useState, useEffect } from 'react';
import { db } from '@/lib/supabase';
import { Task } from '@/types';

export default function FocusMode({ onComplete }: { onComplete: () => void }) {
  const [task, setTask] = useState<Task | null>(null);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25m default
  const [isActive, setIsActive] = useState(false);
  const [load, setLoad] = useState(0);

  useEffect(() => {
    async function initFocus() {
      // Pick one "right now" task from all active boards
      // Logic: Find first Pending task from the lowest active level across all skills
      const skills = await db.getSkills('user_1');
      let selectedTask: Task | null = null;

      for (const skill of skills) {
        const levels = await db.getLevels(skill.id);
        const activeLevel = levels.find(l => !l.isCompleted);
        if (activeLevel) {
          const tasks = await db.getTasks(activeLevel.id);
          const pendingTask = tasks.find(t => t.status === 'Pending');
          if (pendingTask) {
            selectedTask = pendingTask;
            break;
          }
        }
      }

      setTask(selectedTask);

      // Calculate current total load for the meter
      let totalLoad = 0;
      for (const skill of skills) {
        const levels = await db.getLevels(skill.id);
        const activeLevel = levels.find(l => !l.isCompleted);
        if (activeLevel) {
          const tasks = await db.getTasks(activeLevel.id);
          totalLoad += tasks.filter(t => t.status === 'Pending').reduce((acc, t) => acc + t.estimatedLoad, 0);
        }
      }
      setLoad(totalLoad);
    }

    initFocus();
  }, []);

  useEffect(() => {
    let interval: any;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      alert("Focus session complete!");
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950 flex flex-col items-center justify-center p-8 animate-in fade-in duration-500">
      {/* Load Meter at top */}
      <div className="absolute top-12 flex flex-col items-center gap-3">
        <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">System Load</span>
        <div className="w-64 h-2 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
          <div
            className="h-full bg-blue-500 transition-all duration-1000 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
            style={{ width: `${Math.min((load / 20) * 100, 100)}%` }}
          />
        </div>
        <span className="text-xs font-mono text-zinc-600">{load} / 20 Units</span>
      </div>

      {task ? (
        <div className="text-center max-w-3xl space-y-12">
          <div className="space-y-4">
            <span className="text-blue-500 font-mono text-sm uppercase tracking-widest block">Right Now</span>
            <h1 className="text-6xl font-bold font-display text-white leading-tight">
              {task.title}
            </h1>
            <p className="text-xl text-zinc-400 max-w-xl mx-auto">
              {task.description}
            </p>
          </div>

          <div className="flex flex-col items-center gap-8">
            <div className="text-7xl font-mono font-light text-zinc-200 tabular-nums">
              {formatTime(timeLeft)}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setIsActive(!isActive)}
                className={`px-8 py-4 rounded-full font-bold transition-all ${
                  isActive
                    ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                    : 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20'
                }`}
              >
                {isActive ? 'Pause Session' : 'Start Focus'}
              </button>
              <button
                onClick={() => {
                   // Handle task completion
                   onComplete();
                }}
                className="px-8 py-4 rounded-full font-bold bg-zinc-100 text-zinc-900 hover:bg-white transition-all"
              >
                Task Complete
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold">All clear.</h1>
          <p className="text-zinc-400">No pending tasks across your paths.</p>
          <button onClick={onComplete} className="text-blue-500 hover:underline">Return to Dashboard</button>
        </div>
      )}
    </div>
  );
}
