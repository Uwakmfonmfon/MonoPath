"use client";
import React, { useState, useEffect } from 'react';
import { db } from '@/lib/supabase';
import { Skill, LifeLedgerEntry, User } from '@/types';

export default function LifeLedger() {
  const [user, setUser] = useState<User | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [ledger, setLedger] = useState<LifeLedgerEntry[]>([]);

  useEffect(() => {
    async function loadProfile() {
      const userData = await db.getUser('user_1');
      const userWithCats: User = {
        ...userData,
        id: userData?.id || 'guest',
        username: userData?.username || 'Architect',
        currentLoad: userData?.currentLoad || 0,
        maxLoad: userData?.maxLoad || 10,
        createdAt: userData?.createdAt || new Date().toISOString(),
        categoryLevels: userData?.categoryLevels || {
          Health: 1, Creative: 1, Mind: 1, Social: 1, Career: 1
        },
        categoryXp: userData?.categoryXp || {
          Health: 0, Creative: 0, Mind: 0, Social: 0, Career: 0
        }
      };
      setUser(userWithCats);
      const skillData = await db.getSkills('user_1');
      setSkills(skillData);
      const ledgerData = await db.getLedger('user_1');
      setLedger(ledgerData);
    }
    loadProfile();
  }, []);

  const categories: ('Health' | 'Creative' | 'Mind' | 'Social' | 'Career')[] = ['Health', 'Creative', 'Mind', 'Social', 'Career'];

  // Helper to map categories to visual sectors (coordinates)
  const getSector = (cat: string) => {
    const sectors: Record<string, { x: string, color: string }> = {
      Health: { x: 'left-1/4', color: 'text-green-400' },
      Creative: { x: 'top-1/4 left-1/2', color: 'text-neonBlue-glow' },
      Mind: { x: 'right-1/4', color: 'text-purple-400' },
      Social: { x: 'bottom-1/4 left-1/2', color: 'text-orange-400' },
      Career: { x: 'center', color: 'text-yellow-400' },
    };
    return sectors[cat] || { x: 'center', color: 'text-zinc-400' };
  };

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-16 animate-boot duration-1000">
      {/* Header: Identity & Stat HUD */}
      <div className="p-12 bg-obsidian-surface border border-obsidian-border rounded-3xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-neonBlue-glow/5 blur-[120px] rounded-full -mr-32 -mt-32" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-8">
            <div className="relative">
              <div className="w-28 h-28 bg-obsidian-base border-2 border-neonBlue-glow rounded-full flex items-center justify-center text-5xl font-bold text-white shadow-[0_0_20px_rgba(0,240,255,0.2)] relative z-10">
                {user?.username?.[0] || 'K'}
              </div>
              <div className="absolute inset-0 rounded-full animate-pulse-glow" />
            </div>
            <div className="space-y-1">
              <h1 className="text-5xl font-bold font-display text-white tracking-tighter">{user?.username || 'Architect'}</h1>
              <p className="text-neonBlue-accent font-mono text-xs uppercase tracking-[0.4em]">Global Growth Ledger</p>
            </div>
          </div>

          {/* Stat HUD */}
          <div className="flex gap-4 w-full md:w-auto">
            {categories.map(cat => {
              const sector = getSector(cat);
              return (
                <div key={cat} className="flex flex-col items-center p-4 bg-obsidian-base border border-obsidian-border rounded-2xl min-w-[90px] group hover:border-neonBlue-dim transition-all">
                  <span className={`text-[10px] font-mono uppercase mb-2 tracking-widest transition-colors ${sector.color}`}>{cat}</span>
                  <span className="text-3xl font-bold text-white font-display">{user?.categoryLevels[cat] || 1}</span>
                  <div className="w-full h-1 bg-obsidian-border rounded-full mt-3 overflow-hidden">
                    <div
                      className="h-full bg-neonBlue-glow shadow-[0_0_8px_#00F0FF]"
                      style={{ width: `${((user?.categoryXp[cat] || 0) % 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left: The Skill Constellation */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-bold font-display text-white tracking-tight">Skill Constellation</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-obsidian-border to-transparent" />
          </div>

          {/* Constellation Map Container */}
          <div className="relative h-[600px] bg-obsidian-surface border border-obsidian-border rounded-3xl overflow-hidden shadow-inner">
            {/* Background Coordinate Grid */}
            <div className="absolute inset-0 opacity-20"
                 style={{ backgroundImage: 'radial-gradient(circle, #1A1A1A 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            {/* SVG Nebula Connections */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {categories.map(cat => {
                const categorySkills = skills.filter(s => s.category === cat);
                if (categorySkills.length < 2) return null;

                return (
                  <g key={cat} className="opacity-30">
                    {categorySkills.map((s, i) => {
                      if (i === 0) return null;
                      const firstSkill = categorySkills[0];
                      return (
                        <line
                          key={`line-${s.id}`}
                          x1={`${(firstSkill.totalXp / 2000) * 100}%`} // Simplified coord logic
                          y1="50%"
                          x2={`${(s.totalXp / 2000) * 100}%`}
                          y2="50%"
                          stroke={getSector(cat).color.replace('text-', '')}
                          strokeWidth="1"
                          className="animate-pulse"
                        />
                      );
                    })}
                  </g>
                );
              })}
            </svg>

            {/* Skill Nodes */}
            <div className="absolute inset-0">
              {skills.map((skill, idx) => {
                const sector = getSector(skill.category);
                // Deterministic pseudo-random positioning based on skill name + totalXp
                const angle = (idx * (360 / skills.length)) * (Math.PI / 180);
                const radius = 100 + (skill.totalXp / 10); // Further out = more mastery

                return (
                  <div
                    key={skill.id}
                    className="absolute group cursor-pointer transition-all duration-500"
                    style={{
                      left: `calc(50% + ${Math.cos(angle) * radius}px)`,
                      top: `calc(50% + ${Math.sin(angle) * radius}px)`,
                    }}
                  >
                    <div className="relative flex flex-col items-center">
                      {/* The Star */}
                      <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        skill.status === 'Mastered'
                          ? 'bg-yellow-400 shadow-[0_0_15px_#facc15]'
                          : 'bg-neonBlue-glow shadow-[0_0_10px_#00F0FF]'
                      }`} />

                      {/* Tooltip/Label */}
                      <div className="absolute top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap">
                        <div className="bg-obsidian-surface border border-obsidian-border p-3 rounded-xl shadow-2xl min-w-[150px]">
                          <div className="text-xs font-mono text-zinc-500 uppercase mb-1">{skill.category}</div>
                          <div className="font-bold text-white text-sm mb-2">{skill.name}</div>
                          <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400">
                            <span>{skill.totalXp} XP</span>
                            <span className={skill.status === 'Mastered' ? 'text-yellow-400' : 'text-neonBlue-accent'}>
                              {skill.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: The Growth Ledger */}
        <div className="lg:col-span-4 space-y-8">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-bold font-display text-white tracking-tight">Growth Ledger</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-obsidian-border to-transparent" />
          </div>

          <div className="space-y-4">
            {ledger.length > 0 ? ledger.map(entry => (
              <div key={entry.id} className="p-5 bg-obsidian-surface border-l-2 border-neonBlue-glow/30 pl-6 relative group hover:border-neonBlue-glow transition-all">
                <div className="absolute left-[-2px] top-6 w-2 h-2 bg-neonBlue-glow rounded-full shadow-[0_0_5px_#00F0FF]" />
                <div className="text-[10px] font-mono text-zinc-600 mb-1 uppercase tracking-tighter">{entry.timestamp}</div>
                <div className="text-sm text-zinc-300 font-medium group-hover:text-white transition-colors">{entry.description}</div>
                <div className="text-xs text-neonBlue-accent mt-2 font-mono uppercase tracking-widest">{entry.eventType}</div>
              </div>
            )) : (
              <div className="p-12 border border-dashed border-obsidian-border rounded-3xl text-center space-y-4">
                <div className="text-zinc-600 font-mono text-sm italic">Ledger is currently empty.</div>
                <div className="text-xs text-zinc-700 font-mono">Breakthroughs will be recorded here.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
