"use client";
import React, { useState, useEffect } from 'react';
import { db } from '@/lib/supabase';
import { calculateTotalLoad } from '@/lib/load-utils';
import { Skill, Level, Task, TaskStatus } from '@/types';
import { Zap, AlertCircle } from 'lucide-react';
import { detectPlateau, getBreakthroughAction } from '@/lib/plateau-detection';
import PairingQueueStatus from '@/app/components/pairing/PairingQueueStatus';
import MatchFoundModal from '@/app/components/pairing/MatchFoundModal';

export default function TaskBoard({ skillId = 'default_skill' }: { skillId?: string }) {
  const [skill, setSkill] = useState<Skill | null>(null);
  const [levels, setLevels] = useState<Level[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeLevelId, setActiveLevelId] = useState<string | null>(null);
  const [isReflowing, setIsReflowing] = useState(false);
  const [plateauNotice, setPlateauNotice] = useState<{ message: string; action: string } | null>(null);
  const [pairingState, setPairingState] = useState<'IDLE' | 'SEARCHING' | 'MATCHED'>('IDLE');
  const [matchPartner, setMatchPartner] = useState<any>(null);

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

    // Diagnosis: check for plateaus
    const currentLoad = await calculateTotalLoad('user_1');
    const levelProgress = levels.filter(l => l.isCompleted).length / levels.length;
    const plateau = detectPlateau(
      currentSkill.plateauState === 'Confusion' ? 4 : 0, // Mock attempts
      1,
      0,
      currentLoad,
      currentSkill.hoursInvested || 0,
      levelProgress
    );

    if (plateau !== 'None') {
      const breakthrough = getBreakthroughAction(plateau);
      setPlateauNotice({
        message: breakthrough.message,
        action: breakthrough.action
      });
    } else {
      setPlateauNotice(null);
    }
  }

  // Polling for pairing matches
  useEffect(() => {
    let interval: any;
    if (pairingState === 'SEARCHING') {
      interval = setInterval(async () => {
        if (skill) {
          const match = await db.findMatch('user_1');
          if (match) {
            setMatchPartner(match);
            setPairingState('MATCHED');
          }
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [pairingState, skill]);

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
          intake: skill.intakeData,
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

    // Update global system load upon task completion
    const newLoad = await calculateTotalLoad('user_1');
    await db.updateUserLoad('user_1', newLoad);

    // Update Global Character Level
    await db.updateGlobalXp('user_1', task.xpReward);

    // Update Category Level
    if (skill) {
      await db.updateCategoryXp('user_1', skill.category, task.xpReward);
    }

    await checkLevelCompletion();
  }

  async function checkLevelCompletion() {
    const currentTasks = await db.getTasks(activeLevelId!);
    const allCompleted = currentTasks.every(t => t.status === 'Completed');

    if (allCompleted) {
      const currentLevel = levels.find(l => l.id === activeLevelId);
      const nextLevel = levels.find(l => l.levelNumber === (currentLevel?.levelNumber || 0) + 1);

      if (nextLevel) {
        // Check if the current level had a milestone that was completed
        const hasMilestone = currentTasks.some(t => t.isMilestone);
        if (hasMilestone) {
          console.log('Milestone Challenge successfully cleared!');
        }

        await db.addLevel({
          ...nextLevel,
          isCompleted: false,
          unlockedAt: new Date().toISOString(),
        });
        alert(`🎉 Level Up! You've unlocked ${nextLevel.title}`);
        setActiveLevelId(nextLevel.id);
      } else {
        // Final Mastery Achieved
        window.location.href = '/mastery';
      }
    }
  }

  async function triggerPairing() {
    if (!skill) return;
    await db.addToPairingQueue({
      userId: 'user_1',
      plateauType: 'Confusion',
      skillId: skill.id,
      joinedAt: new Date().toISOString()
    });
    setPairingState('SEARCHING');
  }

  async function handleBreakthrough() {
    if (!skill) return;

    // 1. Set isInZone = true
    await db.updateSkill(skill.id, { isInZone: true });

    // 2. Log the breakthrough event
    await db.logEvent({
      id: `event_${Date.now()}`,
      userId: 'user_1',
      timestamp: new Date().toISOString(),
      eventType: 'Breakthrough',
      description: `Collaborative Breakthrough in ${skill.name} with Cognitive Peer`,
      snapshotData: { skillId: skill.id, state: 'Zone Unlocked' }
    });

    // 3. Reset pairing state and refresh skill
    setPairingState('IDLE');
    setMatchPartner(null);
    await loadBoardData();
  }

  useEffect(() => {
    if (activeLevelId) {
      db.getTasks(activeLevelId).then(setTasks);
    }
  }, [activeLevelId]);

  return (
    <div className={`space-y-12 animate-boot duration-700 transition-all duration-1000 ${
      skill?.isInZone
        ? 'is-in-zone bg-gradient-to-br from-obsidian-base via-neonBlue-glow/10 to-obsidian-base shadow-[inset_0_0_100px_rgba(0,240,255,0.1)]'
        : ''
    }`}>
      {pairingState === 'SEARCHING' && (
        <PairingQueueStatus />
      )}

      {pairingState === 'MATCHED' && skill && (
        <MatchFoundModal
          match={matchPartner}
          onBreakthrough={handleBreakthrough}
          onClose={() => setPairingState('IDLE')}
        />
      )}

      {plateauNotice && (
        <div className="p-4 bg-obsidian-surface border border-neonBlue-accent rounded-2xl flex items-center justify-between shadow-2xl animate-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-4">
            <AlertCircle className="text-neonBlue-accent" size={20} />
            <div className="space-y-1">
              <span className="text-xs font-bold text-white uppercase tracking-widest block">Plateau Detected</span>
              <p className="text-sm text-zinc-400 font-mono">{plateauNotice.message}</p>
            </div>
          </div>
          <button
            onClick={() => {
              if (plateauNotice.action === 'Community') {
                triggerPairing();
              } else {
                alert('Forcing a Rest state...');
              }
            }}
            className="px-4 py-2 bg-neonBlue-accent/10 hover:bg-neonBlue-accent/20 text-neonBlue-accent rounded-xl text-xs font-mono transition-all border border-neonBlue-accent/30"
          >
            Resolve {plateauNotice.action} →
          </button>
        </div>
      )}

      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h2 className={`text-5xl font-bold font-display tracking-tighter transition-colors duration-1000 ${
              skill?.isInZone ? 'text-neonBlue-glow drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]' : 'text-white'
            }`}>
              {skill?.name}
            </h2>
            <span className={`px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest border transition-all duration-1000 ${
              skill?.isInZone
                ? 'bg-neonBlue-glow text-obsidian-base border-neonBlue-glow shadow-[0_0_15px_rgba(0,240,255,0.5)]'
                : 'bg-obsidian-surface text-neonBlue-accent border-obsidian-border shadow-[0_0_10px_rgba(0,240,255,0.1)]'
            }`}>
              {skill?.category}
            </span>
          </div>
          <p className="text-zinc-500 font-mono text-sm">{skill?.description}</p>
        </div>

        <div className="text-right space-y-4">
          <div className="flex flex-col items-end">
            <div className="text-[10px] font-mono text-neonBlue-accent uppercase tracking-[0.2em] mb-1">Current Coordinate</div>
            <div className="text-4xl font-bold font-display text-white">LVL {levels.find(l => l.id === activeLevelId)?.levelNumber || 1}</div>
          </div>
          <div className="flex items-center gap-3 bg-obsidian-surface p-2 px-4 rounded-xl border border-obsidian-border shadow-inner">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Invested:</span>
            <span className="text-sm font-bold font-mono text-white">{skill?.hoursInvested || 0}h</span>
            <button
              onClick={() => logHours(1)}
              className="ml-2 px-2 py-0.5 bg-neonBlue-dim/20 hover:bg-neonBlue-dim/40 text-neonBlue-glow rounded text-[10px] font-mono transition-all border border-neonBlue-dim/30"
            >
              +1h
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

        {/* The Mastery Timeline (Left Column) */}
        <div className="lg:col-span-4 space-y-6">
          <h3 className="text-xs font-mono text-zinc-600 uppercase tracking-[0.3em] text-center lg:text-left">Progression Path</h3>

          <div className="relative flex flex-col items-center lg:items-start gap-0 py-4">
            {/* The Vertical Spine */}
            <div className="absolute left-4 lg:left-6 top-0 bottom-0 w-px bg-obsidian-border">
              <div
                className={`absolute top-0 left-0 w-px transition-all duration-1000 ${
                  skill?.isInZone
                    ? 'bg-neonBlue-glow shadow-[0_0_12px_#00F0FF] animate-pulse'
                    : 'bg-neonBlue-glow shadow-[0_0_8px_#00F0FF]'
                }`}
                style={{
                  height: `${(levels.filter(l => l.isCompleted).length / levels.length) * 100}%`,
                }}
              />
            </div>

            {/* The Nodes */}
            {levels.map((lvl) => {
              const isActive = lvl.id === activeLevelId;
              const isCompleted = lvl.isCompleted;

              return (
                <div
                  key={lvl.id}
                  className="relative pl-12 pr-4 py-6 w-full cursor-pointer group"
                  onClick={() => setActiveLevelId(lvl.id)}
                >
                  {/* Node Circle */}
                  <div className={`absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full z-10 transition-all duration-500 ${
                    isCompleted
                      ? 'bg-neonBlue-glow shadow-[0_0_12px_#00F0FF] scale-125'
                      : isActive
                        ? `bg-obsidian-surface border-2 ${skill?.isInZone ? 'border-neonBlue-glow animate-pulse-glow' : 'border-neonBlue-glow animate-pulse-glow'} scale-110`
                        : 'bg-obsidian-border border border-zinc-800'
                  }`} />

                  <div className={`transition-all duration-300 ${isActive ? 'translate-x-2' : ''}`}>
                    <div className={`text-xs font-mono uppercase tracking-tighter mb-1 ${isActive ? 'text-neonBlue-accent' : 'text-zinc-600'}`}>
                      Level {lvl.levelNumber}
                    </div>
                    <div className={`font-semibold transition-colors ${isActive ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                      {lvl.title}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* The Batch Execution (Right Column) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-mono text-zinc-600 uppercase tracking-[0.3em]">Current Batch</h3>
            <button
              onClick={handleReflow}
              disabled={isReflowing}
              className="text-xs text-neonBlue-accent hover:text-neonBlue-glow transition-all font-mono uppercase disabled:opacity-30 flex items-center gap-2 group"
            >
              <span className="group-hover:rotate-180 transition-transform duration-500">🔄</span>
              {isReflowing ? 'Recalculating...' : 'Reflow Path'}
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {tasks.length > 0 ? tasks.map(task => (
              <div
                key={task.id}
                className={`group p-6 rounded-2xl border transition-all duration-500 flex items-center justify-between active:scale-95 ease-out ${
                  task.status === 'Completed'
                    ? 'bg-obsidian-surface/30 border-obsidian-border opacity-40'
                    : `bg-obsidian-surface border-t-white/10 border-x-obsidian-border border-b-black/50 hover:border-neonBlue-dim/50 hover:bg-obsidian-surface/80 shadow-2xl shadow-black ${
                      skill?.isInZone ? 'shadow-[0_0_20px_rgba(0,240,255,0.2)] border-neonBlue-glow/30' : ''
                    }`
                }`}
              >
                <div className="flex items-center gap-6">
                  <div
                    onClick={() => completeTask(task.id)}
                    className={`w-6 h-6 rounded-lg border-2 cursor-pointer flex items-center justify-center transition-all duration-500 ${
                      task.status === 'Completed'
                        ? 'bg-neonBlue-glow border-neonBlue-glow text-obsidian-base scale-95'
                        : 'border-zinc-700 group-hover:border-neonBlue-accent'
                    }`}
                  >
                    {task.status === 'Completed' && <span className="text-xs font-bold">✓</span>}
                  </div>
                  <div>
                    <div className={`font-medium text-lg transition-all ${task.status === 'Completed' ? 'line-through text-zinc-600' : 'text-zinc-100'}`}>
                      {task.title}
                    </div>
                    <div className="text-sm text-zinc-500 font-mono">{task.description}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-1">Reward</div>
                  <div className={`text-sm font-bold font-mono ${task.status === 'Completed' ? 'text-zinc-700' : 'text-neonBlue-accent'}`}>
                    +{task.xpReward} XP
                  </div>
                </div>
              </div>
            )) : (
              <div className="p-16 bg-obsidian-surface/50 backdrop-blur-sm border border-white/5 rounded-3xl text-center space-y-6 shadow-inner">
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-neonBlue-glow/10 flex items-center justify-center text-neonBlue-glow animate-bounce shadow-[0_0_20px_rgba(0,240,255,0.3)]">
                    <Zap size={32} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-zinc-300 font-mono text-lg tracking-tight">Your path is currently silent.</div>
                  <div className="text-xs text-zinc-600 font-mono uppercase tracking-widest">Select a coordinate from the path to initialize your batch.</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
