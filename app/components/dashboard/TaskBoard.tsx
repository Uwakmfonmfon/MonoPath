import React, { useState, useEffect } from 'react';
import { db } from '@/lib/supabase';
import { Skill, Level, Task, TaskStatus } from '@/types';

export default function TaskBoard({ skillId }: { skillId: string }) {
  const [skill, setSkill] = useState<Skill | null>(null);
  const [levels, setLevels] = useState<Level[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeLevelId, setActiveLevelId] = useState<string | null>(null);
  const [isReflowing, setIsReflowing] = useState(false);

  useEffect(() => {
    loadBoardData();
  }, [skillId]);

  async function loadBoardData() {
    const skillData = await db.getSkills('user_1');
    const currentSkill = skillData.find(s => s.id === skillId);
    if (!currentSkill) return;
    setSkill(currentSkill);

    const levelData = await db.getLevels(skillId);
    setLevels(levelData);

    const firstIncomplete = levelData.find(l => !l.isCompleted);
    if (firstIncomplete) {
      setActiveLevelId(firstIncomplete.id);
    }
  }

  async function handleReflow() {
    if (!skill) return;
    setIsReflowing(true);

    try {
      const response = await fetch('/api/generate-path', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'user_1',
          goal: skill.name,
          intake: skill.intakeData, // In a real app, we'd trigger the intake flow first
          skillId: skill.id,
          isReflow: true,
        }),
      });

      if (response.ok) {
        alert('Your path has been reflowed based on your current progress.');
        await loadBoardData();
      }
    } catch (e) {
      alert('Reflow failed. Please try again.');
    } finally {
      setIsReflowing(false);
    }
  }

  async function logHours(hours: number) {
    if (!skill) return;
    const updatedSkill = await db.addSkill({
      ...skill,
      hoursInvested: skill.hoursInvested + hours
    });
    setSkill(updatedSkill);
  }

  async function completeTask(taskId: string) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    await logHours(1);
    await db.updateTask(taskId, { status: 'Completed', completedAt: new Date().toISOString() });
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'Completed' } : t));
    await checkLevelCompletion();
  }

  async function checkLevelCompletion() {
    const currentTasks = await db.getTasks(activeLevelId!);
    const allCompleted = currentTasks.every(t => t.status === 'Completed');

    if (allCompleted) {
      const currentLevel = levels.find(l => l.id === activeLevelId);
      const nextLevel = levels.find(l => l.levelNumber === (currentLevel?.levelNumber || 0) + 1);

      if (nextLevel) {
        await db.addLevel({
          ...nextLevel,
          isCompleted: false,
          unlockedAt: new Date().toISOString(),
        });
        alert(`🎉 Level Up! You've unlocked ${nextLevel.title}`);
        setActiveLevelId(nextLevel.id);
      } else {
        alert('🏆 Mastery Achieved! You have completed this path.');
      }
    }
  }

  useEffect(() => {
    if (activeLevelId) {
      db.getTasks(activeLevelId).then(setTasks);
    }
  }, [activeLevelId]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h2 className="text-4xl font-bold font-display">{skill?.name}</h2>
            <span className="px-3 py-1 bg-zinc-800 text-zinc-400 rounded-full text-xs font-mono uppercase tracking-tighter border border-zinc-700">
              {skill?.category}
            </span>
          </div>
          <p className="text-zinc-400">{skill?.description}</p>
        </div>
        <div className="text-right space-y-4">
          <div className="flex flex-col items-end">
            <div className="text-xs font-mono text-blue-400 uppercase tracking-widest">Current Level</div>
            <div className="text-3xl font-bold font-display">LVL {levels.find(l => l.id === activeLevelId)?.levelNumber || 1}</div>
          </div>
          <div className="flex items-center gap-2 bg-zinc-900 p-2 rounded-lg border border-zinc-800">
            <span className="text-xs font-mono text-zinc-500 uppercase">Invested:</span>
            <span className="text-sm font-bold text-white">{skill?.hoursInvested || 0}h</span>
            <button
              onClick={() => logHours(1)}
              className="ml-2 p-1 bg-zinc-800 hover:bg-zinc-700 rounded text-zinc-400 text-xs transition-all"
            >
              +1h
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-4">
          <h3 className="text-sm font-mono text-zinc-500 uppercase">Progression Path</h3>
          <div className="flex flex-col gap-3">
            {levels.map((lvl, idx) => (
              <div
                key={lvl.id}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  lvl.id === activeLevelId
                    ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                    : lvl.isCompleted
                      ? 'border-zinc-700 bg-zinc-800/50 text-zinc-500'
                      : 'border-zinc-900 bg-zinc-950 text-zinc-700 opacity-50'
                }`}
                onClick={() => !lvl.isCompleted && lvl.id === activeLevelId && setActiveLevelId(lvl.id)}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Level {lvl.levelNumber}: {lvl.title}</span>
                  {lvl.isCompleted && <span>✅</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-mono text-zinc-500 uppercase">Current Batch</h3>
            <button
              onClick={handleReflow}
              disabled={isReflowing}
              className="text-xs text-blue-400 hover:text-blue-300 transition-all font-mono uppercase disabled:opacity-50"
            >
              {isReflowing ? 'Reflowing...' : '🔄 Reflow Path'}
            </button>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {tasks.map(task => (
              <div
                key={task.id}
                className={`p-5 rounded-2xl border transition-all flex items-center justify-between ${
                  task.status === 'Completed'
                    ? 'bg-zinc-900 border-zinc-800 opacity-50'
                    : 'bg-zinc-800 border-zinc-700 hover:border-blue-500'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    onClick={() => completeTask(task.id)}
                    className={`w-6 h-6 rounded-md border-2 cursor-pointer flex items-center justify-center transition-all ${
                      task.status === 'Completed' ? 'bg-blue-500 border-blue-500' : 'border-zinc-600 hover:border-blue-400'
                    }`}
                  >
                    {task.status === 'Completed' && <span className="text-white text-xs">✓</span>}
                  </div>
                  <div>
                    <div className={`font-medium ${task.status === 'Completed' ? 'line-through text-zinc-500' : 'text-zinc-100'}`}>
                      {task.title}
                    </div>
                    <div className="text-sm text-zinc-400">{task.description}</div>
                  </div>
                </div>
                <div className="text-xs font-mono text-zinc-500">
                  +{task.xpReward} XP
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
