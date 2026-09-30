import React, { useState, useEffect } from 'react';
import { db } from '@/lib/supabase';
import { calculateTotalLoad } from '@/lib/load-utils';
import { Task, Skill } from '@/types';
import { detectPlateau, getBreakthroughAction } from '@/lib/plateau-detection';

export default function FocusMode({ onComplete }: { onComplete: () => void }) {
  const [task, setTask] = useState<Task | null>(null);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25m default
  const [isActive, setIsActive] = useState(false);
  const [load, setLoad] = useState(0);
  const [plateauNotification, setPlateauNotification] = useState<{ message: string; action: string } | null>(null);

  useEffect(() => {
    async function initFocus() {
      const userId = 'user_1';
      const skills = await db.getSkills(userId);

      // Calculate current total load
      const currentLoad = await calculateTotalLoad(userId);
      setLoad(currentLoad);

      let selectedTask: Task | null = null;
      const pendingTasks: Task[] = [];

      for (const skill of skills) {
        const levels = await db.getLevels(skill.id);
        const activeLevel = levels.find(l => !l.isCompleted);
        if (activeLevel) {
          const tasks = await db.getTasks(activeLevel.id);
          const pending = tasks.filter(t => t.status === 'Pending');
          pendingTasks.push(...pending);
        }
      }

      // DIAGNOSIS: Check for plateaus on the current skill
      if (skills.length > 0) {
        const activeSkill = skills[0]; // Simplified for now
        const plateau = detectPlateau(
          activeSkill.plateauState === 'Confusion' ? 4 : 0, // Mocking attempts based on existing state
          1, // Mock completions
          0,
          currentLoad,
          activeSkill.hoursInvested || 0,
          0 // Default progress
        );

        if (plateau !== 'None') {
          const breakthrough = getBreakthroughAction(plateau);
          setPlateauNotification({
            message: breakthrough.message,
            action: breakthrough.action
          });
        }
      }

      // PRIORITIZATION LOGIC:
      // If load is > 80% of capacity (20 units), prioritize any 'Rest' tasks
      if (currentLoad > 16) {
        selectedTask = pendingTasks.find(t => t.type === 'Rest') || null;
      }

      // Fallback to first available learning task if no Rest task is needed/available
      if (!selectedTask && pendingTasks.length > 0) {
        selectedTask = pendingTasks[0] || null;
      }

      setTask(selectedTask);
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
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-8 animate-in fade-in duration-1000 transition-all duration-1000 ${
      task?.type === 'Rest'
        ? 'bg-slate-900'
        : 'bg-obsidian-base'
    }`}>
      {/* Subtle radial spotlight effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,205,197,0.05)_0%,transparent_70%)] pointer-events-none" />

      {/* Minimal System Load Indicator */}
      <div className="absolute top-12 right-12 flex flex-col items-end gap-2 opacity-40 hover:opacity-100 transition-opacity duration-500">
        <span className="text-[9px] font-mono text-mutedZinc uppercase tracking-widest">System Load</span>
        <div className="w-32 h-1 bg-obsidian-surface rounded-full overflow-hidden border border-obsidian-border">
          <div
            className={`h-full transition-all duration-1000 ${
              load > 16 ? 'bg-red-500' : 'bg-focusTeal'
            }`}
            style={{ width: `${Math.min((load / 20) * 100, 100)}%` }}
          />
        </div>
        <span className="text-[9px] font-mono text-mutedZinc">{load} / 20 Units</span>
      </div>

      {plateauNotification && (
        <div className="absolute bottom-24 max-w-md p-4 bg-obsidian-surface/80 backdrop-blur-md border border-focusTeal/30 rounded-2xl shadow-2xl animate-in slide-in-from-bottom-4 duration-500 z-50 text-center">
          <div className="space-y-3">
            <p className="text-sm text-paperWhite font-mono">{plateauNotification.message}</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setPlateauNotification(null)}
                className="text-xs font-mono text-mutedZinc hover:text-paperWhite transition-colors"
              >
                Ignore
              </button>
              <button
                onClick={() => {
                  if (plateauNotification.action === 'Community') {
                    alert("Adding you to the Pairing Queue...");
                  }
                  setPlateauNotification(null);
                }}
                className="text-xs font-mono text-focusTeal hover:text-focusTeal/80 transition-colors"
              >
                Resolve {plateauNotification.action} →
              </button>
            </div>
          </div>
        </div>
      )}

      {task ? (
        <div className="relative z-10 text-center max-w-3xl space-y-16">
          <div className="space-y-6">
            <span className={`font-mono text-sm uppercase tracking-widest block ${
              task.type === 'Rest' ? 'text-slate-400' : 'text-focusTeal'
            }`}>
              {task.type === 'Rest' ? 'Recovery Protocol' : 'Active Mastery'}
            </span>
            <h1 className="text-6xl md:text-7xl font-bold font-display text-paperWhite leading-tight tracking-tighter">
              {task.title}
            </h1>
            <p className="text-xl text-mutedZinc max-w-xl mx-auto leading-relaxed font-light">
              {task.description}
            </p>
          </div>

          <div className="flex flex-col items-center gap-12">
            <div className="text-8xl font-mono font-extralight text-paperWhite tabular-nums tracking-tighter">
              {formatTime(timeLeft)}
            </div>

            <div className="flex gap-6">
              <button
                onClick={() => setIsActive(!isActive)}
                className={`px-12 py-4 rounded-full font-bold transition-all duration-500 ${
                  isActive
                    ? 'bg-obsidian-surface text-mutedZinc hover:text-paperWhite border border-obsidian-border'
                    : 'bg-focusTeal text-obsidian-base hover:scale-105 shadow-[0_0_20px_rgba(79,205,197,0.3)]'
                }`}
              >
                {isActive ? 'Pause Session' : 'Start Focus'}
              </button>
              <button
                onClick={() => onComplete()}
                className="px-12 py-4 rounded-full font-bold bg-transparent text-paperWhite border border-obsidian-border hover:bg-obsidian-surface transition-all"
              >
                Task Complete
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold font-display text-paperWhite">All clear.</h1>
          <p className="text-mutedZinc font-mono">No pending tasks across your paths.</p>
          <button onClick={onComplete} className="text-focusTeal hover:text-focusTeal/80 transition-colors font-mono uppercase tracking-widest text-xs">Return to Dashboard</button>
        </div>
      )}
    </div>
  );
}
